import transformers
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset

transformers.logging.set_verbosity_info()
model_name = "facebook/bart-large-cnn"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
# dataset = "ccdv/arxiv-summarization"
dataset = "vgoldberg/longform_article_summarization"
output_dir = "./models/bart-large-longform_article_summ"

# Print stuff for debugging
# print(dataset.keys())
# print(dataset['train'][0])
# # Iterate over each split and print the keys (columns) and their counts
# for split in dataset.keys():
#     print(f"Keys in the {split} split:")
#     # Access the dataset split
#     split_dataset = dataset[split]
#     # Print the columns in this split
#     print(split_dataset.column_names)
#     # Print the number of entries in each column (which is uniform across all columns):
#     print(f"Number of entries in {split} split:", len(split_dataset))

# arxiv-summarization: article and abstracts used for dataset
# def tokenize_function(examples):
#     model_inputs = tokenizer(examples["article"], padding="max_length", truncation=True, max_length=512)
#     # Setup the tokenizer for targets
#     with tokenizer.as_target_tokenizer():
#         labels = tokenizer(examples["abstract"], padding="max_length", truncation=True, max_length=128)

#     model_inputs["labels"] = labels["input_ids"]
#     return model_inputs

# Tokenize the dataset - arxiv-summarization
# tokenized_datasets = dataset.map(tokenize_function, batched=True)
# train_dataset = dataset['train'].shuffle(seed=42).select(range(100))
# val_dataset = dataset['validation'].shuffle(seed=42).select(range(100))

# def preprocess_function(examples):
#     # Filter out None values robustly and keep track of lengths
#     texts = [text if text is not None else "" for text in examples['text']]
#     summaries = [summary if summary is not None else "" for summary in examples['summary']]
#     return {'text': texts, 'summary': summaries}

# def tokenize_function(examples):
#     # Tokenize the inputs and labels
#     model_inputs = tokenizer(examples['text'], max_length=512, truncation=True, padding="max_length")
#     labels = tokenizer(examples['summary'], max_length=128, truncation=True, padding="max_length")
#     # Ensuring lengths match
#     assert len(model_inputs['input_ids']) == len(labels['input_ids']), "Mismatch in tokenized input lengths"
#     return {'input_ids': model_inputs['input_ids'], 'attention_mask': model_inputs['attention_mask'], 'labels': labels['input_ids']}

# processed_dataset = dataset.map(preprocess_function, batched=True, remove_columns=['text', 'summary'])
# tokenized_dataset = processed_dataset.map(tokenize_function, batched=True)

# split_datasets = tokenized_dataset['train'].train_test_split(test_size=1 - 0.8, seed=42)

# train_dataset = split_datasets['train'].shuffle(seed=42).select(range(100))
# val_dataset = split_datasets['test'].shuffle(seed=42).select(range(100))

def preprocess_generic(examples, text_key, summary_key):
    texts = [text if text is not None else "" for text in examples[text_key]]
    summaries = [summary if summary is not None else "" for summary in examples[summary_key]]
    return {text_key: texts, summary_key: summaries}

def tokenize_generic(examples, tokenizer, text_key, summary_key, max_length=512, max_target_length=128):
    model_inputs = tokenizer(examples[text_key], max_length=max_length, truncation=True, padding="max_length")
    labels = tokenizer(examples[summary_key], max_length=max_target_length, truncation=True, padding="max_length")
    # Ensure lengths match
    assert len(model_inputs['input_ids']) == len(labels['input_ids']), "Mismatch in tokenized input lengths"
    return {'input_ids': model_inputs['input_ids'], 'attention_mask': model_inputs['attention_mask'], 'labels': labels['input_ids']}

def get_dataset_config(dataset_name):
    if dataset_name == "ccdv/arxiv-summarization":
        return {
            "text_key": "article",
            "summary_key": "abstract",
            "preprocess_function": None,  # No preprocessing needed
            "max_length": 512,
            "max_target_length": 128
        }
    elif dataset_name == "vgoldberg/longform_article_summarization":
        return {
            "text_key": "text",
            "summary_key": "summary",
            "preprocess_function": preprocess_generic,
            "max_length": 512,
            "max_target_length": 128
        }
    else:
        raise ValueError("Unsupported dataset")

def prepare_datasets(dataset_name, tokenizer):
    config = get_dataset_config(dataset_name)
    dataset = load_dataset(dataset_name)

    if config["preprocess_function"]:
        dataset = dataset.map(lambda x: config["preprocess_function"](x, config["text_key"], config["summary_key"]), batched=True, remove_columns=[config["text_key"], config["summary_key"]])

    tokenized_dataset = dataset.map(lambda x: tokenize_generic(x, tokenizer, config["text_key"], config["summary_key"], config["max_length"], config["max_target_length"]), batched=True)

    if "train" in tokenized_dataset and "test" not in tokenized_dataset:
        # Split train dataset if no explicit validation set
        split_datasets = tokenized_dataset["train"].train_test_split(test_size=0.2, seed=42)
        return split_datasets["train"], split_datasets["test"]
    else:
        return tokenized_dataset["train"], tokenized_dataset["validation"]

train_dataset, val_dataset = prepare_datasets(dataset, tokenizer)
train_dataset = train_dataset.shuffle(seed=42).select(range(50))
val_dataset = val_dataset.shuffle(seed=42).select(range(50))

training_args = TrainingArguments(
    output_dir='./saved_models',     # output directory
    num_train_epochs=3,              # total number of training epochs
    per_device_train_batch_size=8,   # batch size per device during training
    warmup_steps=25,                # number of warmup steps for learning rate scheduler
    weight_decay=0.01,               # strength of weight decay
    logging_dir='./logs',            # directory for storing logs
    logging_steps=10,
    evaluation_strategy="steps",
    eval_steps=25,                  # evaluation and save happens every 500 steps
    # save_strategy="epoch",         # save the model every epoch
    save_strategy="no",              # do not automatically save the model
    save_total_limit=3,              # only the last 3 models are saved
    learning_rate=5e-5,              # starting learning rate: 0.00005
)

trainer = Trainer(
    model=model,
    args=training_args,
    # train_dataset=tokenized_datasets["train"],
    # eval_dataset=tokenized_datasets["val"],
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
)

trainer.train()
model.save_pretrained(output_dir)
import transformers
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer, Trainer, TrainingArguments
from datasets import load_dataset, DatasetDict

transformers.logging.set_verbosity_info()
model_name = "facebook/bart-large-cnn"
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)
dataset = load_dataset("ccdv/arxiv-summarization")
print(dataset.keys())

def tokenize_function(examples):
    model_inputs = tokenizer(examples["article"], padding="max_length", truncation=True, max_length=512)
    # Setup the tokenizer for targets
    with tokenizer.as_target_tokenizer():
        labels = tokenizer(examples["abstract"], padding="max_length", truncation=True, max_length=128)

    model_inputs["labels"] = labels["input_ids"]
    return model_inputs

tokenized_datasets = dataset.map(tokenize_function, batched=True)
small_train_dataset = tokenized_datasets["train"].shuffle(seed=42).select(range(100))  # Selects first 100 examples
small_eval_dataset = tokenized_datasets["validation"].shuffle(seed=42).select(range(100))  # Selects first 100 examples

training_args = TrainingArguments(
    output_dir='./saved_models',     # output directory
    num_train_epochs=3,              # total number of training epochs
    per_device_train_batch_size=4,   # batch size per device during training
    warmup_steps=500,                # number of warmup steps for learning rate scheduler
    weight_decay=0.01,               # strength of weight decay
    logging_dir='./logs',            # directory for storing logs
    logging_steps=10,
    evaluation_strategy="steps",
    eval_steps=500,                  # evaluation and save happens every 500 steps
    save_strategy="epoch",           # save the model every epoch
    save_total_limit=3,              # only the last 3 models are saved
)

trainer = Trainer(
    model=model,
    args=training_args,
    # train_dataset=tokenized_datasets["train"],
    # eval_dataset=tokenized_datasets["val"],
    train_dataset=small_train_dataset,
    eval_dataset=small_eval_dataset,
)

trainer.train()
model.save_pretrained('./saved_models/bart-large-arxiv-2')
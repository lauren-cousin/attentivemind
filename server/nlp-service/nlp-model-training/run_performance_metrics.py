from datasets import load_metric

# Load metrics
rouge = load_metric('rouge')

references = [["""For evolutionists the revolution in DNA technology has been a major advance. The reason is that the very nature of DNA allows it to be used as a "document" of evolutionary history: comparisons of the DNA sequences of various genes between different organisms can tell us a lot about the relationships of organisms that cannot be correctly inferred from morphology. One definite problem is that the DNA itself is a scattered and fragmentary "document" of history and we have to beware of the effects of changes in the genome that can bias our picture of organismal evolution.
Two general approaches to molecular evolution are to 1) use DNA to study the evolution of organisms (such as population structure, geographic variation and systematics) and to 2) to use different organisms to study the evolution of DNA. To the hard-core molecular evolutionist of the latter type, organisms are just another source of DNA. Our general goal in all this is to infer process from pattern and this applies to the processes of organismal evolution deduced from patterns of DNA variation, and processes of molecular evolution inferred from the patterns of variation in the DNA itself. An important issue is that there are processes of DNA change within the genome that can alter the picture we infer about both organismal and DNA evolution: the genome is fluid and some of the very processes that make genomes "fluid" are of great interest to evolutionary biologists. Thus molecular evolution might be called the "natural history of DNA". The points that follow are some interesting observations interspersed with some basic concepts.
Some important background: DNA has many different roles in terms of function. Most of our DNA does not code for proteins (more below) and thus is quite a different type of character/trait than DNA that does code for protein. In eukaryotes, genes are frequently broken up into exons (expressed) and introns (spliced out of the RNA before becoming a true messenger RNA). The genes also have regulatory sequences that indicate when and where to transcribe the DNA into RNA for protein synthesis. The genetic code is the information system for translating the sequence of RNA into the sequence of amino acids. Within this triplet code some of the nucleotide positions are silent or synonymous because any nucleotide in that position will do (see table 2.1 pg. 25). This "universal" code is not completely universal because the mitochondrial genome uses some of the codons in different ways (e.g., some termination codons in the universal code specify amino acids in the mitochondrial code). Thus even the genetic code can evolve.

Some important theoretical background: we want to develop a picture of what happens to a new mutant in a population, lets say a single nucleotide change a one position in the DNA. This is the starting point for molecular evolution. If the new mutant is governed by genetic drift, its fate should be quite different than another nucleotide mutation that is governed by selection (see below). To describe molecular evolution Kimura formulated the Neutral theory of molecular evolution which is remarkably simple. If:

u = mutation rate / gene / generation, N = population size, then the number of new mutations occurring per generation in a population = 2Nu (2 because we are considering diploid organisms)."""]]

# Summarization BART base model: Molecular Evolution
base_model_outputs = [["""DNA can be used as a "document" of evolutionary history. It can tell us a lot about the relationships of organisms that cannot be correctly inferred from morphology. DNA itself is a scattered and fragmentary " document" of history and we have to beware of the effects of changes in the genome that can bias our picture of organismal evolution. The genome is fluid and some of the very processes that make genomes "fluid" are of great interest to evolutionary biologists. Thus molecular evolution might be called the "natural history of DNA"."""]]
# Summarization Custom model: Molecular Evolution
custom_model_outputs = [["""DNA is a "document" of evolutionary history and can tell us a lot about the relationships of organisms that cannot be correctly inferred from morphology, but the DNA itself is a scattered and fragmentary " document" of history and we have to beware of the effects of changes in the genome that can bias our picture of organismal evolution. To describe molecular evolution Kimura formulated the Neutral theory of molecular evolution which is remarkably simple: N = mutation rate / gene / generation, N = population size, then the number of new mutations occurring per generation in a population = 2Nu."""]]
# Summarization Falconsai/text_summarization base model: Molecular Evolution
falconsai_model_outputs = [["""Evolutionists have been a major advance in DNA technology . The DNA itself is a scattered and fragmentary "document" of history . We have to beware of the effects of changes in the genome that can bias our picture ."""]]
# Summarization google/pegasus-cnn_dailymail base model: Molecular Evoluation
google_pegasus_model_outputs = [["""evolutionists use DNA to study the evolution of organisms .<n>To the hard-core molecular evolutionist, organisms are just another source of DNA .<n>Process of DNA change within the genome can alter the picture we infer about both organismal and DNA evolution ."""]]


def compute_results(model_outputs, references):
    # Compute ROUGE
    rouge_result = rouge.compute(predictions=model_outputs, references=references)
    print("ROUGE Score:", rouge_result)

print("\nBART Base Model Summarization Results:")
compute_results(base_model_outputs, references)
print("\nCustom Model Summarization Results:")
compute_results(custom_model_outputs, references)
print("\nFalconsAI Model Summarization Results:")
compute_results(falconsai_model_outputs, references)
print("\nGoogle Pegasus Model Summarization Results:")
compute_results(google_pegasus_model_outputs, references)
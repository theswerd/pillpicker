# Pill Picker
![Static Badge](https://img.shields.io/badge/lang-python-blue)
![Static Badge](https://img.shields.io/badge/lang-rust-orange)
![Static Badge](https://img.shields.io/badge/lang-typescript-yellow)

![Static Badge](https://img.shields.io/badge/easyfsl-blue)
![Static Badge](https://img.shields.io/badge/pytorch-blue)
![Static Badge](https://img.shields.io/badge/fastapi-blue)
![Static Badge](https://img.shields.io/badge/rocket-orange)
![Static Badge](https://img.shields.io/badge/rayon-orange)
![Static Badge](https://img.shields.io/badge/geo-orange)
![Static Badge](https://img.shields.io/badge/solidjs-yellow)
![Static Badge](https://img.shields.io/badge/vite-yellow)
![Static Badge](https://img.shields.io/badge/tailwind-pink)

### About
VeriPill is an accessible, affordable, easy-to-use technology that patients can use to reduce medication errors by receiving verification on their prescribed medication in seconds.


## RUNTIME DIAGRRAM
```mermaid
sequenceDiagram
    Website->>+Web Server: Hello John, how are you?
    Web Server-->Embedding Service: Get Embedding
    Web Server-->Vector Search Service: Find Highest Scoring Embedding
    Web Server-->>-Website: Return highest score
```

## DATA PIPELINE DIAGRAM
```mermaid
flowchart TD
    A[NLM Database] -->|Pull Pill Data| B(Data Processor)
    B --> C[Format for web search]
    B --> E[Format for Model Training]
    E --> F[Pull Images]
    E --> G[format pandas dataframe]
    G -->J
    F --> J[Train Model]
    J --> K[Extract Embeddings]
    G --> K
    C --> L{Text Search}
    K --> M{Vector Search}
    %% C -->|One| D[Laptop]
    %% C -->|Two| E[iPhone]
    %% C -->|Three| F[fa:fa-car Car]
```



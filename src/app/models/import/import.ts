export interface Import {
    salesOrder?: string;
    date?: string;               // ou Date, dependendo do tratamento
    status?: 'I' | 'E';          // 'I' = Integrado, 'E' = Erro
    cnpj?: string;
    priceTable?: string;
    paymentCondition?: string;
    discountPercent?: number;
    purchaseOrder?: string;
    issueDate?: string;          // ou Date
    fileName?: string; 
}

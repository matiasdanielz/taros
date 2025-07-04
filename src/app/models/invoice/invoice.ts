export interface Invoice {
    id?: string;
    serial?: string;
    customerStore?: string;
    customerId?: string;
    customerName?: string;
    issueDate?: string;       // data, string ou Date
    totalValue?: number;
    icmsBase?: number;
    icmsValue?: number;
    ipiBase?: number;
    ipiValue?: number;
    goodsValue?: number;
    icmsRetained?: number;
    netWeight?: number;
    grossWeight?: number;
    carrier?: string;
    otherTaxBase?: number;
    otherTaxValue1?: number;
    otherTaxValue2?: number;
    nfApprovalDate?: string;  // data
    nfApprovalTime?: string;
}

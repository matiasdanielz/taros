
export interface Commission {
    year?: number;
    monthLabel?: string;
    commissionsAmount?: number;
    salesBase?: number;
    commissionValue?: number;
    items?: CommissionItem[]
}

export interface CommissionItem {
    branch?: string;
    invoice?: string;
    order?: string;
    serial?: string;
    parcel?: string;
    emissionDate?: string;       // ou Date, se desejar
    customer?: string;
    customerName?: string;
    salesBase?: number;
    commissionValue?: number;
    percentage?: number;
    type?: string;
    store?: string;
    issueClearance?: string;     // ou Date
    dueDate?: string;
}

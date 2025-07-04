export interface Customer {
    id?: string;
    store?: string;
    status?: '1' | '2';             // '1' = Inativo, '2' = Ativo
    name?: string;
    fantasyName?: string;
    type?: 'L' | 'F' | 'R' | 'S' | 'X';  // Tipo de Cliente
    person?: 'J' | 'F';             // Pessoa Jurídica ou Física
    brazilianTaxId?: string;        // CNPJ ou CPF
    stateInscription?: string;      // Inscrição Estadual
    adress?: string;                // Note: está como 'adress' no JSON, talvez 'address'?
    neighborhood?: string;
    city?: string;
    state?: string;
    zip?: string;                   // CEP
    phone?: string;
    email?: string;
    paymentCondition?: string;      // Condição de Pagamento
    priceTable?: string; 
}

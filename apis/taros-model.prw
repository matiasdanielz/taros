#include 'protheus.ch'
#include 'topconn.ch'
#Include "Totvs.ch"
#Include "parmtype.ch"
#Include "tbiconn.ch"

class TarosModel from longclassname
    method New() CONSTRUCTOR
    method Login()
    method GetCustomers()
    method GetInvoices()
    method GetSalesRequests()
    method GetCommissions()
    method GetPayConditions()
    method GetPriceTables()
    method GetProducts()
    method GetOperations()
    method GetSalesman()
endclass

method New() class TarosModel
    return self

method Login(cUserName, cPassword) class TarosModel
    local oResponse    := JsonObject():New()
    local oSessionInfo := JsonObject():New()
    local bIsLogged    := .f.

    BeginSql Alias "SQL_LOGIN"
        SELECT
            A3_COD
        FROM
            %Table:SA3% SA3
        WHERE
            SA3.A3_LOGIN = %Exp:cUserName%
        AND
            SA3.A3_PWSAPI = %Exp:cPassword%
    EndSql

    If !SQL_LOGIN->(EoF())
        oSessionInfo['userId'] := SA3->A3_COD

        bIsLogged := .T.
    EndIf
    SQL_LOGIN->(DbCloseArea())

    oResponse[ 'isLogged' ]    := bIsLogged
    oResponse[ 'sessionInfo' ] := oSessionInfo

    return oResponse

method GetCustomers(nPage, nPageSize, cFilter) class TarosModel
    local oCustomer   := JsonObject():New()
    local aCustomers  := {}
    Local nOffset     := 0
    local oResponse   := JsonObject():New()

    Default nPage     := 0
	Default nPageSize := 10
	Default cFilter   := ''

    nOffset := nPageSize * nPage

    BeginSql Alias "SQL_CUSTOMERS"
        SELECT
            A1_COD AS CODIGO,
            A1_LOJA AS LOJA,
            A1_NOME AS NOME,
            A1_NREDUZ AS NOME_REDUZIDO,
            A1_TIPO AS TIPO_CLIENTE,
            A1_PESSOA AS PESSOA,
            A1_CGC AS CNPJ_CPF,
            A1_INSCR AS INSCRICAO_ESTADUAL,
            A1_END AS ENDERECO,
            A1_BAIRRO AS BAIRRO,
            A1_MUN AS CIDADE,
            A1_EST AS ESTADO,
            A1_CEP AS CEP,
            A1_TEL AS TELEFONE,
            A1_EMAIL AS EMAIL,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SA1% SA1
        WHERE
            (UPPER(A1_COD) LIKE UPPER('%' + %Exp:cFilter% + '%')
            OR UPPER(A1_NOME) LIKE UPPER('%' + %Exp:cFilter% + '%')
            OR UPPER(A1_CGC) LIKE UPPER('%' + %Exp:cFilter% + '%'))
        AND 
            D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_CUSTOMERS->TOTAL
	oResponse['hasNext'] := SQL_CUSTOMERS->TOTAL > (nPage + 1) * nPageSize

    While !SQL_CUSTOMERS->(EoF())
        oCustomer[ 'id' ] := ALLTRIM(SQL_CUSTOMERS->CODIGO)
        oCustomer[ 'store' ] := ALLTRIM(SQL_CUSTOMERS->LOJA)
        oCustomer[ 'name' ] := ALLTRIM(SQL_CUSTOMERS->NOME)
        oCustomer[ 'fantasyName' ] := ALLTRIM(SQL_CUSTOMERS->NOME_REDUZIDO)
        oCustomer[ 'type' ] := ALLTRIM(SQL_CUSTOMERS->TIPO_CLIENTE)
        oCustomer[ 'person' ] := ALLTRIM(SQL_CUSTOMERS->PESSOA)
        oCustomer[ 'brazilianTaxId' ] := ALLTRIM(SQL_CUSTOMERS->CNPJ_CPF)
        oCustomer[ 'stateInscription' ] := ALLTRIM(SQL_CUSTOMERS->INSCRICAO_ESTADUAL)
        oCustomer[ 'adress' ] := ALLTRIM(SQL_CUSTOMERS->ENDERECO)
        oCustomer[ 'neighborhood' ] := ALLTRIM(SQL_CUSTOMERS->BAIRRO)
        oCustomer[ 'city' ] := ALLTRIM(SQL_CUSTOMERS->CIDADE)
        oCustomer[ 'state' ] := ALLTRIM(SQL_CUSTOMERS->ESTADO)
        oCustomer[ 'zip' ] := ALLTRIM(SQL_CUSTOMERS->CEP)
        oCustomer[ 'phone' ] := ALLTRIM(SQL_CUSTOMERS->TELEFONE)
        oCustomer[ 'email' ] := ALLTRIM(SQL_CUSTOMERS->EMAIL)

        aadd(aCustomers, oCustomer)
        oCustomer := JsonObject():New()

        SQL_CUSTOMERS->(DbSkip())
    EndDo
    SQL_CUSTOMERS->(DbCloseArea())

    oResponse['items'] := aCustomers

    return oResponse

method GetInvoices(nPage, nPageSize, cFilter) class TarosModel
    local oInvoice  := JsonObject():New()
    local aInvoices := {}
    Local nOffset   := 0
    local oResponse := JsonObject():New()

    Default nPage     := 0
	Default nPageSize := 10
	Default cFilter   := ''

    nOffset := nPageSize * nPage

    BeginSql Alias "SQL_INVOICES"
        SELECT
            F2_DOC AS CODIGO,
            F2_SERIE SERIE,
            A1_NOME AS CLIENTE,
            F2_LOJA AS LOJA,
            F2_EMISSAO AS DATAEMISSAO,
            F2_VALBRUT AS VALORTOTAL,
            E4_DESCRI AS CONDPAGAMENTO,
            F2_DESCONT AS DESCONTO,
            F2_VEND1 AS VENDEDOR,
            F2_ESPECIE AS TIPODOCUMENTO,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SF2% SF2
        LEFT JOIN
            %Table:SA1% SA1 ON A1_COD = F2_CLIENTE AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SE4% SE4 ON E4_CODIGO = F2_COND AND SE4.D_E_L_E_T_ = ''
        WHERE
            UPPER(F2_DOC) LIKE UPPER('%' + %Exp:cFilter% + '%')
        AND 
            SF2.D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_INVOICES->TOTAL
    oResponse['hasNext'] := SQL_INVOICES->TOTAL > (nPage + 1) * nPageSize

    While !SQL_INVOICES->(EoF())
        oInvoice[ 'id' ]               := ALLTRIM(SQL_INVOICES->CODIGO)
        oInvoice[ 'serial' ]           := ALLTRIM(SQL_INVOICES->SERIE)
        oInvoice[ 'client' ]           := ALLTRIM(SQL_INVOICES->CLIENTE)
        oInvoice[ 'store' ]            := ALLTRIM(SQL_INVOICES->LOJA)
        oInvoice[ 'issueDate' ]        := IIF(EMPTY(SQL_INVOICES->DATAEMISSAO), '' , cvaltochar(year2Str(stod(SQL_INVOICES->DATAEMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_INVOICES->DATAEMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_INVOICES->DATAEMISSAO))))
        //oInvoice[ 'dueDate' ]          := ALLTRIM(SQL_INVOICES->DATAVENCIMENTO)
        oInvoice[ 'totalValue' ]       := SQL_INVOICES->VALORTOTAL
        //oInvoice['status'] := ALLTRIM(SQL_INVOICES->STATUS)
        oInvoice[ 'paymentCondition' ] := ALLTRIM(SQL_INVOICES->CONDPAGAMENTO)
        oInvoice[ 'discount' ]         := SQL_INVOICES->DESCONTO
        oInvoice[ 'salesperson' ]      := ALLTRIM(SQL_INVOICES->VENDEDOR)
        //;oInvoice['salesCommission'] := SQL_INVOICES->COMISSAOVENDEDOR
        //oInvoice[ 'orderNumber' ]      := ALLTRIM(SQL_INVOICES->NUMEROPEDIDO)
        oInvoice[ 'documentType' ]     := ALLTRIM(SQL_INVOICES->TIPODOCUMENTO)
        //oInvoice['nfNumber'] := ALLTRIM(SQL_INVOICES->NOTAFISCAL)
        //oInvoice['cfop'] := ALLTRIM(SQL_INVOICES->CFOP)

        aadd(aInvoices, oInvoice)
        oInvoice := JsonObject():New()

        SQL_INVOICES->(DbSkip())
    EndDo
    SQL_INVOICES->(DbCloseArea())

    oResponse['items'] := aInvoices

    return oResponse


method GetSalesRequests(nPage, nPageSize, cFilter) class TarosModel
    local oSalesRequest  := JsonObject():New()
    local aSalesRequests := {}
    Local nOffset        := 0
    local oResponse      := JsonObject():New()

    Default nPage     := 0
	Default nPageSize := 10
	Default cFilter   := ''

    nOffset := nPageSize * nPage

    BeginSql Alias "SQL_SALES_REQUESTS"
        SELECT
            C5_NUM          AS CODIGO,
            C5_FILIAL       AS FILIAL,
            C5_CLIENTE      AS CODIGO_CLIENTE,
            A1_NOME         AS NOME_CLIENTE,
            C5_LOJACLI      AS LOJA,
            C5_TIPO         AS TIPO_PEDIDO,
            C5_EMISSAO      AS DATA_EMISSAO,
            E4_DESCRI       AS CONDICAO_PAGAMENTO,
            C5_VEND1        AS VENDEDOR,
            A4_NOME         AS TRANSPORTADORA,
            C5_DESCONT      AS DESCONTO,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SC5% SC5
        LEFT JOIN
            %Table:SA1% SA1 ON A1_COD = C5_CLIENTE AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SE4% SE4 ON E4_CODIGO = C5_CONDPAG AND SE4.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SA4% SA4 ON A4_COD = C5_TRANSP AND SA4.D_E_L_E_T_ = ''
        WHERE
            UPPER(C5_NUM) LIKE UPPER('%' + %Exp:cFilter% + '%')
        AND 
           SC5.D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_SALES_REQUESTS->TOTAL
    oResponse['hasNext'] := SQL_SALES_REQUESTS->TOTAL > (nPage + 1) * nPageSize

    While !SQL_SALES_REQUESTS->(EoF())
        oSalesRequest[ 'orderNumber' ]      := ALLTRIM(SQL_SALES_REQUESTS->CODIGO)
        oSalesRequest[ 'branch' ]           := ALLTRIM(SQL_SALES_REQUESTS->FILIAL)
        oSalesRequest[ 'customerCode' ]     := ALLTRIM(SQL_SALES_REQUESTS->CODIGO_CLIENTE)
        oSalesRequest[ 'store' ]            := ALLTRIM(SQL_SALES_REQUESTS->LOJA)
        oSalesRequest[ 'customerName' ]     := ALLTRIM(SQL_SALES_REQUESTS->NOME_CLIENTE)
        oSalesRequest[ 'orderType' ]        := ALLTRIM(SQL_SALES_REQUESTS->TIPO_PEDIDO)
        oSalesRequest[ 'issueDate' ]        := IIF(EMPTY(SQL_SALES_REQUESTS->DATA_EMISSAO), '', cvaltochar(year2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))))
        oSalesRequest[ 'paymentCondition' ] := ALLTRIM(SQL_SALES_REQUESTS->CONDICAO_PAGAMENTO)
        oSalesRequest[ 'salesman' ]         := ALLTRIM(SQL_SALES_REQUESTS->VENDEDOR)
        oSalesRequest[ 'shippingName' ]     := ALLTRIM(SQL_SALES_REQUESTS->TRANSPORTADORA)
        //oSalesRequest['totalValue'] := SQL_SALES_REQUESTS->VALOR_TOTAL
        oSalesRequest[ 'discount' ]         := SQL_SALES_REQUESTS->DESCONTO
        //oSalesRequest['cfop'] := ALLTRIM(SQL_SALES_REQUESTS->CFOP)
        //oSalesRequest['orderObservation'] := ALLTRIM(SQL_SALES_REQUESTS->OBSERVACAO_PEDIDO)

        aadd(aSalesRequests, oSalesRequest)
        oSalesRequest := JsonObject():New()

        SQL_SALES_REQUESTS->(DbSkip())
    EndDo
    SQL_SALES_REQUESTS->(DbCloseArea())

    oResponse['items'] := aSalesRequests

    return oResponse
  
method GetCommissions(cSalesmanId) class TarosModel
    local oCommission  := JsonObject():New()
    local aCommissions := {}
    local oResponse      := JsonObject():New()

    BeginSql Alias "SQL_COMMISSIONS"
        SELECT
            E3_FILIAL AS FILIAL,
            E3_NUM AS ID,
            E3_EMISSAO AS EMISSAO,
            E3_SERIE AS SERIE,
            E3_CODCLI AS CLIENTE,
            E3_BASE AS BASE,
            E3_PORC AS PORCENTAGEM,
            E3_COMIS AS COMISSAO,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SE3% SE3
        WHERE 
           SE3.D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_COMMISSIONS->TOTAL
    //oResponse['hasNext'] := SQL_COMMISSIONS->TOTAL > (nPage + 1) * nPageSize

    While !SQL_COMMISSIONS->(EoF())
        oCommission[ 'branch' ]          := ALLTRIM(SQL_COMMISSIONS->FILIAL)
        oCommission[ 'id' ]              := ALLTRIM(SQL_COMMISSIONS->ID)
        oCommission[ 'emissionDate' ]    := IIF(EMPTY(SQL_COMMISSIONS->EMISSAO), '' , cvaltochar(year2Str(stod(SQL_COMMISSIONS->EMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_COMMISSIONS->EMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_COMMISSIONS->EMISSAO))))
        oCommission[ 'serial' ]          := ALLTRIM(SQL_COMMISSIONS->SERIE)
        oCommission[ 'customer' ]        := ALLTRIM(SQL_COMMISSIONS->CLIENTE)
        oCommission[ 'sales' ]           := ALLTRIM(SQL_COMMISSIONS->BASE)
        oCommission[ 'commissionValue' ] := ALLTRIM(SQL_COMMISSIONS->COMISSAO)

        aadd(aCommissions, oCommission)
        oCommission := JsonObject():New()

        SQL_COMMISSIONS->(DbSkip())
    EndDo
    SQL_COMMISSIONS->(DbCloseArea())

    oResponse['items'] := aCommissions

    return oResponse


method GetPayConditions(cId, cFilter) class TarosModel
    local oPayCondition  := JsonObject():New()
    local aPayConditions  := {}
    local oResponse := JsonObject():New()

    if cId == nil
        cId := ""
    end

    if cFilter == nil
        cFilter := ""
    end

    BeginSql Alias "SQL_SE4"
        SELECT
            E4_CODIGO,
            E4_DESCRI
        FROM 
            %Table:SE4% SE4
        WHERE
            D_E_L_E_T_ = ''
        AND (
            %Exp:cId% = ''
            OR E4_CODIGO = %Exp:cId%
        )        
        AND
            (%Exp:cFilter% = '' OR UPPER(E4_DESCRI) LIKE UPPER(%Exp:cFilter% + '%'))
    EndSql

    While !SQL_SE4->(EoF())
        oPayCondition[ 'value' ] := alltrim(SQL_SE4->E4_CODIGO)
        oPayCondition[ 'label' ] := alltrim(SQL_SE4->E4_DESCRI)

        aadd(aPayConditions, oPayCondition)
        oPayCondition := JsonObject():New()

        SQL_SE4->(DbSkip())
    EndDo
    SQL_SE4->(DbCloseArea())

    oResponse['items'] := aPayConditions

    return oResponse

method GetPriceTables(cId, cFilter) class TarosModel
    local oPriceTable  := JsonObject():New()
    local aPriceTables  := {}
    local oResponse := JsonObject():New()

    if cId == nil
        cId := ""
    end

    if cFilter == nil
        cFilter := ""
    end

    BeginSql Alias "SQL_DA0"
        SELECT
            DA0_CODTAB,
            DA0_DESCRI
        FROM 
            %Table:DA0% DA0
        WHERE
            D_E_L_E_T_ = ''
        AND (
            %Exp:cId% = ''
            OR DA0_CODTAB = %Exp:cId%
        )        
        AND
            (%Exp:cFilter% = '' OR UPPER(DA0_DESCRI) LIKE UPPER(%Exp:cFilter% + '%'))
    EndSql

    While !SQL_DA0->(EoF())
        oPriceTable[ 'value' ] := alltrim(SQL_DA0->DA0_CODTAB)
        oPriceTable[ 'label' ] := alltrim(SQL_DA0->DA0_DESCRI)

        aadd(aPriceTables, oPriceTable)
        oPriceTable := JsonObject():New()

        SQL_DA0->(DbSkip())
    EndDo
    SQL_DA0->(DbCloseArea())

    oResponse['items'] := aPriceTables

    return oResponse


method GetProducts(cId, cFilter) class TarosModel
    local oProduct  := JsonObject():New()
    local aProducts  := {}
    local oResponse := JsonObject():New()

    if cId == nil
        cId := ""
    end

    if cFilter == nil
        cFilter := ""
    end

    BeginSql Alias "SQL_SB1"
        SELECT
            B1_COD,
            B1_DESC
        FROM 
            %Table:SB1% SB1
        WHERE
            D_E_L_E_T_ = ''
        AND (
            %Exp:cId% = ''
            OR B1_COD = %Exp:cId%
        )        
        AND
            (%Exp:cFilter% = '' OR UPPER(B1_DESC) LIKE UPPER(%Exp:cFilter% + '%'))
    EndSql

    While !SQL_SB1->(EoF())
        oProduct[ 'value' ] := alltrim(SQL_SB1->B1_COD)
        oProduct[ 'label' ] := alltrim(SQL_SB1->B1_DESC)

        aadd(aProducts, oProduct)
        oProduct := JsonObject():New()

        SQL_SB1->(DbSkip())
    EndDo
    SQL_SB1->(DbCloseArea())

    oResponse['items'] := aProducts

    return oResponse


method GetOperations(cId, cFilter) class TarosModel
    local oOperation  := JsonObject():New()
    local aOperations  := {}
    local oResponse := JsonObject():New()

    if cId == nil
        cId := ""
    end

    if cFilter == nil
        cFilter := ""
    end

    BeginSql Alias "SQL_SX5"
        SELECT
            X5_CHAVE,
            X5_DESCRI
        FROM 
            %Table:SX5% SX5
        WHERE
            D_E_L_E_T_ = ''
        AND (
            %Exp:cId% = ''
            OR X5_CHAVE = %Exp:cId%
        )        
        AND
            (%Exp:cFilter% = '' OR UPPER(X5_DESCRI) LIKE UPPER(%Exp:cFilter% + '%'))
    EndSql

    While !SQL_SX5->(EoF())
        oOperation[ 'value' ] := alltrim(SQL_SX5->X5_CHAVE)
        oOperation[ 'label' ] := alltrim(SQL_SX5->X5_DESCRI)

        aadd(aOperations, oOperation)
        oOperation := JsonObject():New()

        SQL_SX5->(DbSkip())
    EndDo
    SQL_SX5->(DbCloseArea())

    oResponse['items'] := aOperations

    return oResponse

method GetSalesman(cSalesmanId) class TarosModel
    local oResponse     := JsonObject():New()
    local oSalesmanInfo := JsonObject():New()

    BeginSql Alias "SQL_SALESMAN"
        SELECT
            A3_NOME NOME,
            A3_COD CODIGO,
            A3_CGC CPF,
            A3_EMAIL EMAIL,
            A3_TEL TELEFONE,
            A3_CEL CELULAR,
            A3_END ENDERECO,
            A3_MUN MUNICIPIO,
            A3_EST ESTADO,
            A3_CEP CEP,
            A3_COMIS COMISSAO
        FROM
            %Table:SA3% SA3
        WHERE
            SA3.A3_COD = %Exp:cSalesmanId%
    EndSql

    If !SQL_SALESMAN->(EoF())
        oSalesmanInfo['nome']      := Alltrim(SA3->A3_NOME)
        oSalesmanInfo['codigo']    := Alltrim(SA3->A3_COD)
        oSalesmanInfo['cpf']       := Alltrim(SA3->A3_CGC)
        oSalesmanInfo['email']     := Alltrim(SA3->A3_EMAIL)
        oSalesmanInfo['telefone']  := Alltrim(SA3->A3_TEL)
        oSalesmanInfo['celular']   := Alltrim(SA3->A3_CEL)
        oSalesmanInfo['endereco']  := Alltrim(SA3->A3_END)
        oSalesmanInfo['municipio'] := Alltrim(SA3->A3_MUN)
        oSalesmanInfo['estado']    := Alltrim(SA3->A3_EST)
        oSalesmanInfo['cep']       := Alltrim(SA3->A3_CEP)
        oSalesmanInfo['comissao']  := Alltrim(SA3->A3_COMIS)

    EndIf
    SQL_SALESMAN->(DbCloseArea())

    oResponse[ 'salesmanInfo' ] := oSalesmanInfo

    return oResponse

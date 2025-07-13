#include 'protheus.ch'
#include 'topconn.ch'
#Include "Totvs.ch"
#Include "parmtype.ch"
#Include "tbiconn.ch"

class TarosModel from longclassname
    method New() CONSTRUCTOR
    method Login()
    method GetCusts()
    method GetHInvc()
    method GetIInvc()
    method GetSReqs()
    method GetHComm()
    method GetIComm()
    method GetPayCnd()
    method GetPrTbl()
    method GetProds()
    method GetOps()
    method GetSman()
    method GetSBudg()
    method GetImpts()
    method GetISRqs()
    method GetISBdg()
endclass

method New() class TarosModel
    return self

method Login(cUserId, cPassword) class TarosModel
    local oResponse    := JsonObject():New()
    local oSessionInfo := JsonObject():New()
    local bIsLogged    := .f.

    BeginSql Alias "SQL_LOGIN"
        SELECT
            A3_COD,
            A3_NREDUZ
        FROM
            %Table:SA3% SA3
        WHERE
            SA3.A3_LOGIN = %Exp:cUserId%
        AND
            SA3.A3_PWSAPI = %Exp:cPassword%
    EndSql

    If !SQL_LOGIN->(EoF())
        oSessionInfo['userId'] := SQL_LOGIN->A3_COD
        oSessionInfo['name'] := Alltrim(SQL_LOGIN->A3_NREDUZ)

        bIsLogged := .T.
    EndIf
    SQL_LOGIN->(DbCloseArea())

    oResponse[ 'isLogged' ]    := bIsLogged
    oResponse[ 'sessionInfo' ] := oSessionInfo

    return oResponse

method GetCusts(cSalesmanId, cFilter, cInitialDate, cEndDate) class TarosModel
    local oCustomer   := JsonObject():New()
    local aCustomers  := {}
    local oResponse   := JsonObject():New()

	Default cFilter      := ''
	Default cInitialDate := ''
	Default cEndDate     := ''

    BeginSql Alias "SQL_CUSTOMERS"
        SELECT
            A1_FILIAL AS FILIAL,
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
            A1_COND AS CONDPAG,
            E4_DESCRI AS NOME_CONDPAG,
            DA0_DESCRI AS NOME_TABELA,
            A1_TABELA AS TABELA,
            A1_MSBLQL AS STATUS,
            A1_TPFRET AS TIPO_FRETE,
            A4_NOME AS TRANSPORTADORA,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SA1% SA1
        LEFT JOIN
            %Table:SE4% SE4 ON SE4.E4_CODIGO = A1_COND AND SE4.D_E_L_E_T_ = ''
        LEFT JOIN    
            %Table:DA0% DA0 ON DA0.DA0_CODTAB = A1_TABELA AND DA0.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SA4% SA4 ON A4_COD = A1_TRANSP AND A4_FILIAL = %XFILIAL:SA4% AND SA4.D_E_L_E_T_ = ''
        WHERE
            (
                UPPER(A1_COD) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_LOJA) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_NOME) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_NREDUZ) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_TIPO) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_PESSOA) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_CGC) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_INSCR) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_END) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_BAIRRO) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_MUN) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_EST) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_CEP) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_TEL) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_COND) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_TABELA) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_EMAIL) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_MSBLQL) LIKE UPPER('%' || %Exp:cFilter% || '%')
            )
        AND
            (%Exp:cInitialDate% = '' OR A1_DTCAD > %Exp:cInitialDate%)
        AND
            (%Exp:cEndDate% = '' OR A1_DTCAD < %Exp:cEndDate%)
        AND
            A1_VEND = %Exp:cSalesmanId%
        AND 
            SA1.D_E_L_E_T_ = ''
        ORDER BY A1_COD ASC
    EndSql

    oResponse['total'] := SQL_CUSTOMERS->TOTAL

    While !SQL_CUSTOMERS->(EoF())
        oCustomer[ 'branch' ]               := ALLTRIM(SQL_CUSTOMERS->FILIAL)
        oCustomer[ 'id' ]                   := ALLTRIM(SQL_CUSTOMERS->CODIGO)
        oCustomer[ 'store' ]                := ALLTRIM(SQL_CUSTOMERS->LOJA)
        oCustomer[ 'name' ]                 := ALLTRIM(SQL_CUSTOMERS->NOME)
        oCustomer[ 'fantasyName' ]          := ALLTRIM(SQL_CUSTOMERS->NOME_REDUZIDO)
        oCustomer[ 'type' ]                 := ALLTRIM(SQL_CUSTOMERS->TIPO_CLIENTE)
        oCustomer[ 'person' ]               := ALLTRIM(SQL_CUSTOMERS->PESSOA)
        oCustomer[ 'brazilianTaxId' ]       := ALLTRIM(SQL_CUSTOMERS->CNPJ_CPF)
        oCustomer[ 'stateInscription' ]     := ALLTRIM(SQL_CUSTOMERS->INSCRICAO_ESTADUAL)
        oCustomer[ 'adress' ]               := ALLTRIM(SQL_CUSTOMERS->ENDERECO)
        oCustomer[ 'neighborhood' ]         := ALLTRIM(SQL_CUSTOMERS->BAIRRO)
        oCustomer[ 'city' ]                 := ALLTRIM(SQL_CUSTOMERS->CIDADE)
        oCustomer[ 'state' ]                := ALLTRIM(SQL_CUSTOMERS->ESTADO)
        oCustomer[ 'zip' ]                  := ALLTRIM(SQL_CUSTOMERS->CEP)
        oCustomer[ 'phone' ]                := ALLTRIM(SQL_CUSTOMERS->TELEFONE)
        oCustomer[ 'email' ]                := ALLTRIM(SQL_CUSTOMERS->EMAIL)
        oCustomer[ 'paymentConditionName' ] := ALLTRIM(SQL_CUSTOMERS->NOME_CONDPAG)
        oCustomer[ 'paymentCondition' ]     := ALLTRIM(SQL_CUSTOMERS->CONDPAG)
        oCustomer[ 'priceTableName' ]       := ALLTRIM(SQL_CUSTOMERS->NOME_TABELA)
        oCustomer[ 'priceTable' ]           := ALLTRIM(SQL_CUSTOMERS->TABELA)
        oCustomer[ 'status' ]               := ALLTRIM(SQL_CUSTOMERS->STATUS)
        oCustomer[ 'carrier' ]              := ALLTRIM(SQL_CUSTOMERS->TRANSPORTADORA)
        oCustomer[ 'C5_TPFRETE' ]           := ALLTRIM(SQL_CUSTOMERS->TIPO_FRETE)

        aadd(aCustomers, oCustomer)
        oCustomer := JsonObject():New()

        SQL_CUSTOMERS->(DbSkip())
    EndDo
    SQL_CUSTOMERS->(DbCloseArea())

    oResponse['items'] := aCustomers

    return oResponse

method GetHInvc(cSalesmanId, cFilter) class TarosModel
    local oInvoice  := JsonObject():New()
    local aInvoices := {}
    local oResponse := JsonObject():New()

	Default cSalesmanId   := ''
	Default cFilter   := ''

    BeginSql Alias "SQL_INVOICES"
        SELECT
            F2_FILIAL AS FILIAL,
            F2_DOC AS CODIGO,
            F2_SERIE SERIE,
            A1_LOJA AS LOJA_CLIENTE,
            A1_COD AS ID_CLIENTE,
            A1_NOME AS CLIENTE,
            F2_LOJA AS LOJA,
            F2_EMISSAO AS DATA_EMISSAO,
            F2_VALBRUT AS VALOR_TOTAL,
            F2_BASEICM AS BASE_ICMS,
            F2_VALICM AS VALOR_ICMS,
            F2_BASEIPI AS BASE_IPI,
            F2_VALIPI AS VALOR_IPI,
            F2_VALMERC AS VALOR_MERCADO,
            F2_ICMSRET AS ICMS_RETIDO,
            F2_PLIQUI AS PESO_LIQUIDO,
            F2_PBRUTO AS PESO_BRUTO,
            F2_TRANSP AS TRANSPORTADORA,
            F2_BASIMP5 AS BASE_IMP_5,
            F2_VALIMP5 AS VALOR_IMP_5,
            F2_VALIMP6 AS VALOR_IMP_6,
            F2_VALIMP6 AS VALOR_IMP_6,
            F2_DAUTNFE AS DATA_AUT_NF,
            F2_HAUTNFE AS HORA_AUT_NF,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SF2% SF2
        LEFT JOIN
            %Table:SA1% SA1 ON A1_COD = F2_CLIENTE AND A1_LOJA = F2_LOJA AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SE4% SE4 ON E4_CODIGO = F2_COND AND E4_FILIAL = %xfilial:SE4% AND SE4.D_E_L_E_T_ = ''
        WHERE
            F2_VEND1 = %EXP:cSalesmanId%
        AND
            UPPER(F2_DOC) LIKE UPPER('%' + %Exp:cFilter% + '%')
        AND 
            SF2.D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_INVOICES->TOTAL

    While !SQL_INVOICES->(EoF())
        oInvoice[ 'branch' ]             := ALLTRIM(SQL_INVOICES->FILIAL)
        oInvoice[ 'id' ]             := ALLTRIM(SQL_INVOICES->CODIGO)
        oInvoice[ 'serial' ]         := ALLTRIM(SQL_INVOICES->SERIE)
        oInvoice[ 'customerStore' ]  := ALLTRIM(SQL_INVOICES->LOJA_CLIENTE)
        oInvoice[ 'customerId' ]     := ALLTRIM(SQL_INVOICES->ID_CLIENTE)
        oInvoice[ 'customerName' ]   := ALLTRIM(SQL_INVOICES->CLIENTE)
        oInvoice[ 'issueDate' ]      := IIF(EMPTY(SQL_INVOICES->DATA_EMISSAO), '' , cvaltochar(year2Str(stod(SQL_INVOICES->DATA_EMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_INVOICES->DATA_EMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_INVOICES->DATA_EMISSAO))))
        oInvoice[ 'totalAmount' ]    := SQL_INVOICES->VALOR_TOTAL // Valor total da nota
        oInvoice[ 'icmsBase' ]       := SQL_INVOICES->BASE_ICMS // Base de cálculo do ICMS
        oInvoice[ 'icmsValue' ]      := SQL_INVOICES->VALOR_ICMS // Valor do ICMS
        oInvoice[ 'ipiBase' ]        := SQL_INVOICES->BASE_IPI // Base de cálculo do IPI
        oInvoice[ 'ipiValue' ]       := SQL_INVOICES->VALOR_IPI // Valor do IPI
        oInvoice[ 'goodsValue' ]     := SQL_INVOICES->VALOR_MERCADO // Valor das mercadorias
        oInvoice[ 'icmsRetained' ]   := SQL_INVOICES->ICMS_RETIDO // ICMS Retido
        oInvoice[ 'netWeight' ]      := SQL_INVOICES->PESO_LIQUIDO // Peso líquido
        oInvoice[ 'grossWeight' ]    := SQL_INVOICES->PESO_BRUTO // Peso bruto
        oInvoice[ 'carrier' ]        := SQL_INVOICES->TRANSPORTADORA // Transportadora
        oInvoice[ 'otherTaxBase' ]   := SQL_INVOICES->BASE_IMP_5 // Base de outro imposto (ex: ISS ou outro customizado)
        oInvoice[ 'otherTaxValue1' ] := SQL_INVOICES->VALOR_IMP_5 // Valor do outro imposto 1
        oInvoice[ 'otherTaxValue2' ] := SQL_INVOICES->VALOR_IMP_6 // Valor do outro imposto 2
        oInvoice[ 'nfApprovalDate' ] := IIF(EMPTY(SQL_INVOICES->DATA_AUT_NF), '' , cvaltochar(year2Str(stod(SQL_INVOICES->DATA_AUT_NF))) + "-" + cvaltochar(Month2Str(stod(SQL_INVOICES->DATA_AUT_NF))) + '-' + cvaltochar(Day2Str(stod(SQL_INVOICES->DATA_AUT_NF)))) // Data de autorização da NF
        oInvoice[ 'nfApprovalTime' ] := SQL_INVOICES->HORA_AUT_NF // Hora de autorização da NF
        oInvoice[ 'items' ]          := ::GetIInvc(SQL_INVOICES->CODIGO)['items']

        aadd(aInvoices, oInvoice)
        oInvoice := JsonObject():New()

        SQL_INVOICES->(DbSkip())
    EndDo
    SQL_INVOICES->(DbCloseArea())

    oResponse['items'] := aInvoices

    return oResponse

method GetIInvc(cInvoiceId) class TarosModel
    local oInvoice  := JsonObject():New()
    local aInvoices := {}
    local oResponse      := JsonObject():New()

	Default cInvoiceId := ''

    BeginSql Alias "SQL_ITEMS_INVOICES"
        SELECT
            D2_ITEM AS ITEM,
            B1_DESC AS PRODUTO,
            D2_QUANT AS QTDVEN,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SD2% SD2
        LEFT JOIN
            %Table:SB1% SB1 ON B1_COD = D2_COD
        WHERE
            SD2.D_E_L_E_T_ = ''
        AND 
            D2_DOC = %Exp:cInvoiceId%
    EndSql

    oResponse['total'] := SQL_ITEMS_INVOICES->TOTAL

    While !SQL_ITEMS_INVOICES->(EoF())
        oInvoice[ 'D2_ITEM' ]    := ALLTRIM(SQL_ITEMS_INVOICES->ITEM)
        oInvoice[ 'D2_PRODUTO' ] := ALLTRIM(SQL_ITEMS_INVOICES->PRODUTO)
        oInvoice[ 'D2_QUANT' ]  := SQL_ITEMS_INVOICES->QTDVEN

        aadd(aInvoices, oInvoice)
        oInvoice := JsonObject():New()

        SQL_ITEMS_INVOICES->(DbSkip())
    EndDo
    SQL_ITEMS_INVOICES->(DbCloseArea())

    oResponse['items'] := aInvoices

    return oResponse

method GetSReqs(cSalesmanId, cFilter, cInitialDate, cEndDate) class TarosModel
    local oSalesRequest  := JsonObject():New()
    local aSalesRequests := {}
    local oResponse      := JsonObject():New()

	Default cSalesmanId   := ''
	Default cFilter   := ''
	Default cInitialDate   := ''
	Default cEndDate   := ''

    BeginSql Alias "SQL_SALES_REQUESTS"
        SELECT
            C5_NUM          AS CODIGO,
            C5_FILIAL       AS FILIAL,
            C5_CLIENTE      AS CODIGO_CLIENTE,
            A1_NOME         AS NOME_CLIENTE,
            C5_LOJACLI      AS LOJA,
            C5_EMISSAO      AS DATA_EMISSAO,
            E4_DESCRI       AS CONDICAO_PAGAMENTO,
            A4_NOME         AS TRANSPORTADORA,
            C5_DESCONT      AS DESCONTO,
            C5_PEDECOM      AS C5_PEDECOM,
            CASE
                WHEN (
                    C5_LIBEROK = ''
                    AND C5_NOTA = ''
                    AND C5_BLQ = ''
                ) THEN 'emAberto'
                WHEN (
                    C5_NOTA <> ''
                    OR C5_LIBEROK = 'E'
                    AND C5_BLQ = ''
                ) THEN 'encerrado'
                WHEN (
                    C5_NOTA = ''
                    AND C5_LIBEROK <> ''
                    AND C5_BLQ = ''
                ) THEN 'liberado'
                WHEN (
                    C5_BLQ = '1'
                ) THEN 'bloqueadoPorRegra'
                WHEN (
                    C5_BLQ = '2'
                ) THEN 'bloqueadoPorVerba'
                WHEN EXISTS (
                    SELECT * 
                    FROM 
                        %Table:SC9% SC9 
                    WHERE 
                        SC9.D_E_L_E_T_ <> '*' 
                    AND 
                        C9_FILIAL = %xFilial:SC9% 
                    AND 
                        C9_PEDIDO = SC5.C5_NUM 
                    AND 
                        C9_BLEST <> '' 
                ) THEN 'bloqueadoPorEstoque'
                WHEN EXISTS (
                    SELECT * 
                    FROM 
                        %Table:SC9% SC9 
                    WHERE 
                        SC9.D_E_L_E_T_ <> '*' 
                    AND 
                        C9_FILIAL = %xFilial:SC9% 
                    AND 
                        C9_PEDIDO = SC5.C5_NUM 
                    AND 
                        C9_BLCRED <> ''
                ) THEN 'bloqueadoPorCredito'
                ELSE 'naoIdentificado'
            END AS STATUS,
            C5_TRANSP AS TRANSPORTADORA,
            C5_TPFRETE AS TIPO_FRETE,
            C5_TABELA AS TABELA_PRECO,
            C5_MENNOTA AS MSG_NOTA,
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
            C5_VEND1 = %EXP:cSalesmanId%
        AND
            (%Exp:cInitialDate% = '' OR C5_EMISSAO > %Exp:cInitialDate%)
        AND
            (%Exp:cEndDate% = '' OR C5_EMISSAO < %Exp:cEndDate%)
        AND
            (
                UPPER(C5_NUM) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(C5_FILIAL) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(C5_CLIENTE) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A1_NOME) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(C5_LOJACLI) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(E4_DESCRI) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(A4_NOME) LIKE UPPER('%' || %Exp:cFilter% || '%')
            )
        AND 
            SC5.D_E_L_E_T_ = ''
        ORDER BY 
            C5_NUM DESC
    EndSql

    oResponse['total'] := SQL_SALES_REQUESTS->TOTAL

    While !SQL_SALES_REQUESTS->(EoF())
        oSalesRequest[ 'orderNumber' ]      := ALLTRIM(SQL_SALES_REQUESTS->CODIGO)
        oSalesRequest[ 'branch' ]           := ALLTRIM(SQL_SALES_REQUESTS->FILIAL)
        oSalesRequest[ 'customerCode' ]     := ALLTRIM(SQL_SALES_REQUESTS->CODIGO_CLIENTE)
        oSalesRequest[ 'store' ]            := ALLTRIM(SQL_SALES_REQUESTS->LOJA)
        oSalesRequest[ 'customerName' ]     := ALLTRIM(SQL_SALES_REQUESTS->NOME_CLIENTE)
        oSalesRequest[ 'issueDate' ]        := IIF(EMPTY(SQL_SALES_REQUESTS->DATA_EMISSAO), '', cvaltochar(year2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_SALES_REQUESTS->DATA_EMISSAO))))
        oSalesRequest[ 'paymentCondition' ] := ALLTRIM(SQL_SALES_REQUESTS->CONDICAO_PAGAMENTO)
        oSalesRequest[ 'carrier' ]          := ALLTRIM(SQL_SALES_REQUESTS->TRANSPORTADORA)
        oSalesRequest[ 'shippingMethod' ]   := ALLTRIM(SQL_SALES_REQUESTS->TIPO_FRETE)
        oSalesRequest[ 'discount' ]         := SQL_SALES_REQUESTS->DESCONTO
        oSalesRequest[ 'priceTable' ]       := SQL_SALES_REQUESTS->TABELA_PRECO
        oSalesRequest[ 'status' ]           := Alltrim(SQL_SALES_REQUESTS->STATUS)
        oSalesRequest[ 'C5_MENNOTA' ]       := Alltrim(SQL_SALES_REQUESTS->MSG_NOTA)
        oSalesRequest[ 'C5_PEDECOM' ]       := Alltrim(SQL_SALES_REQUESTS->C5_PEDECOM)
        oSalesRequest[ 'items' ]            := ::GetISRqs(SQL_SALES_REQUESTS->CODIGO)['items']

        aadd(aSalesRequests, oSalesRequest)
        oSalesRequest := JsonObject():New()

        SQL_SALES_REQUESTS->(DbSkip())
    EndDo
    SQL_SALES_REQUESTS->(DbCloseArea())

    oResponse['items'] := aSalesRequests

    return oResponse

method GetISRqs(cSalesRequestId) class TarosModel
    local oSalesRequest  := JsonObject():New()
    local aSalesRequests := {}
    local oResponse      := JsonObject():New()

    Default cSalesRequestId := ""

    BeginSql Alias "SQL_ITEMS_SALES_REQUESTS"
        SELECT
            C6_ITEM AS ITEM,
            C6_PRODUTO AS PRODUTO,
            B1_DESC AS DESC_PRODUTO,
            C6_QTDVEN AS QTDVEN,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SC6% SC6
        LEFT JOIN
            %Table:SB1% SB1 ON B1_COD = C6_PRODUTO
        WHERE
            SC6.D_E_L_E_T_ = ''
        AND 
            C6_NUM = %Exp:cSalesRequestId%
    EndSql

    oResponse['total'] := SQL_ITEMS_SALES_REQUESTS->TOTAL

    While !SQL_ITEMS_SALES_REQUESTS->(EoF())
        oSalesRequest[ 'C6_ITEM' ]    := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->ITEM)
        oSalesRequest[ 'C6_PRODUTO' ] := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->PRODUTO)
        oSalesRequest[ 'B1_DESC' ]    := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->DESC_PRODUTO)
        oSalesRequest[ 'C6_QTDVEN' ]  := SQL_ITEMS_SALES_REQUESTS->QTDVEN

        aadd(aSalesRequests, oSalesRequest)
        oSalesRequest := JsonObject():New()

        SQL_ITEMS_SALES_REQUESTS->(DbSkip())
    EndDo
    SQL_ITEMS_SALES_REQUESTS->(DbCloseArea())

    oResponse['items'] := aSalesRequests

    return oResponse

method GetHComm(cSalesmanId, cFilter) class TarosModel
    local oHeaderCommission  := JsonObject():New()
    local aHeaderCommissions := {}
    local oResponse      := JsonObject():New()
    Local aMonths := { "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", ;
                "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro" }

    Default cSalesmanId := ""
    Default cFilter := ""

    BeginSql Alias "SQL_HEADER_COMMISSIONS"
        SELECT 
            SUBSTRING(E3_EMISSAO, 1, 4) AS ANO,
            SUBSTRING(E3_EMISSAO, 5, 2) AS MES,
            SUBSTRING(E3_EMISSAO, 1, 6) AS ANO_MES,
            COUNT(E3_EMISSAO) AS QTDE_COMISSOES,
            SUM(E3_BASE) AS VENDAS,
            SUM(E3_COMIS) AS COMISSAO,
            COUNT(*) AS TOTAL
        FROM 
            %Table:SE3% SE3
        WHERE 
           E3_VEND = %EXP:cSalesmanId%
        AND
            SE3.D_E_L_E_T_ = ''
        GROUP BY 
            SUBSTRING(E3_EMISSAO, 1, 4),
            SUBSTRING(E3_EMISSAO, 5, 2),
            SUBSTRING(E3_EMISSAO, 1, 6)
        ORDER BY 
            ANO_MES
    EndSql

    While !SQL_HEADER_COMMISSIONS->(EoF())
        oHeaderCommission[ 'year' ]              := alltrim(SQL_HEADER_COMMISSIONS->ANO)
        oHeaderCommission[ 'month' ]             := alltrim(SQL_HEADER_COMMISSIONS->MES)
        oHeaderCommission[ 'monthLabel' ]        := aMonths[val(SQL_HEADER_COMMISSIONS->MES)]
        oHeaderCommission[ 'commissionsAmount' ] := SQL_HEADER_COMMISSIONS->QTDE_COMISSOES
        oHeaderCommission[ 'salesBase' ]         := SQL_HEADER_COMMISSIONS->VENDAS
        oHeaderCommission[ 'commissionValue' ]   := SQL_HEADER_COMMISSIONS->COMISSAO
        oHeaderCommission[ 'items' ]             := ::GetIComm(SQL_HEADER_COMMISSIONS->ANO_MES)[ 'items' ]

        aadd(aHeaderCommissions, oHeaderCommission)
        oHeaderCommission := JsonObject():New()

        SQL_HEADER_COMMISSIONS->(DbSkip())
    EndDo
    SQL_HEADER_COMMISSIONS->(DbCloseArea())

    oResponse['items'] := aHeaderCommissions

    return oResponse

method GetIComm(cYearAndMonth) class TarosModel
    local oCommission  := JsonObject():New()
    local aCommissions := {}
    local oResponse    := JsonObject():New()

    Default cYearAndMonth := ""

    BeginSql Alias "SQL_ITEMS_COMMISSIONS"
        SELECT
            E3_FILIAL AS FILIAL,
            E3_NUM AS ID,
            E3_EMISSAO AS EMISSAO,
            E3_SERIE AS SERIE,
            A1_NOME AS NOME_CLIENTE,
            E3_CODCLI AS CLIENTE,
            E3_BASE AS BASE,
            E3_PORC AS PORCENTAGEM,
            E3_COMIS AS COMISSAO,
            E3_PARCELA AS PARCELA,
            E3_TIPO AS TIPO,
            E3_LOJA AS LOJA,
            E3_BAIEMI AS BAIXA_EMISSAO,
            E3_PEDIDO AS PEDIDO,
            E3_VENCTO AS VENCIMENTO,
            C5_NOTA AS NF,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SE3% SE3
        LEFT JOIN
            %Table:SA1% SA1 ON A1_COD = E3_CODCLI
        LEFT JOIN
            %Table:SC5% SC5 ON C5_NUM = E3_PEDIDO AND C5_FILIAL = E3_FILIAL
        WHERE 
           SE3.D_E_L_E_T_ = ''
        AND
            SUBSTRING(E3_EMISSAO, 1, 6) = %Exp:cYearAndMonth%
    EndSql

    oResponse['total'] := SQL_ITEMS_COMMISSIONS->TOTAL
    //oResponse['hasNext'] := SQL_ITEMS_COMMISSIONS->TOTAL > (nPage + 1) * nPageSize

    While !SQL_ITEMS_COMMISSIONS->(EoF())
            oCommission[ 'branch' ]          := ALLTRIM(SQL_ITEMS_COMMISSIONS->FILIAL)
            oCommission[ 'id' ]              := ALLTRIM(SQL_ITEMS_COMMISSIONS->ID)
            oCommission[ 'emissionDate' ]    := IIF(EMPTY(SQL_ITEMS_COMMISSIONS->EMISSAO), '' , ;
                                                    cvaltochar(year2Str(stod(SQL_ITEMS_COMMISSIONS->EMISSAO))) + "-" + ;
                                                    cvaltochar(Month2Str(stod(SQL_ITEMS_COMMISSIONS->EMISSAO))) + "-" + ;
                                                    cvaltochar(Day2Str(stod(SQL_ITEMS_COMMISSIONS->EMISSAO))))
            oCommission[ 'serial' ]          := ALLTRIM(SQL_ITEMS_COMMISSIONS->SERIE)
            oCommission[ 'customer' ]        := ALLTRIM(SQL_ITEMS_COMMISSIONS->CLIENTE)
            oCommission[ 'customerName' ]    := ALLTRIM(SQL_ITEMS_COMMISSIONS->NOME_CLIENTE)
            oCommission[ 'salesBase' ]       := SQL_ITEMS_COMMISSIONS->BASE
            oCommission[ 'percentage' ]      := SQL_ITEMS_COMMISSIONS->PORCENTAGEM
            oCommission[ 'commissionValue' ] := SQL_ITEMS_COMMISSIONS->COMISSAO
            oCommission[ 'parcel' ]          := SQL_ITEMS_COMMISSIONS->PARCELA
            oCommission[ 'type' ]            := ALLTRIM(SQL_ITEMS_COMMISSIONS->TIPO)
            oCommission[ 'store' ]           := ALLTRIM(SQL_ITEMS_COMMISSIONS->LOJA)
            oCommission[ 'issueClearance' ]  := IIF(EMPTY(SQL_ITEMS_COMMISSIONS->BAIXA_EMISSAO), '' , ;
                                                    cvaltochar(year2Str(stod(SQL_ITEMS_COMMISSIONS->BAIXA_EMISSAO))) + "-" + ;
                                                    cvaltochar(Month2Str(stod(SQL_ITEMS_COMMISSIONS->BAIXA_EMISSAO))) + "-" + ;
                                                    cvaltochar(Day2Str(stod(SQL_ITEMS_COMMISSIONS->BAIXA_EMISSAO))))
            oCommission[ 'order' ]           := ALLTRIM(SQL_ITEMS_COMMISSIONS->PEDIDO)
            oCommission[ 'dueDate' ]         := IIF(EMPTY(SQL_ITEMS_COMMISSIONS->VENCIMENTO), '' , ;
                                                    cvaltochar(year2Str(stod(SQL_ITEMS_COMMISSIONS->VENCIMENTO))) + "-" + ;
                                                    cvaltochar(Month2Str(stod(SQL_ITEMS_COMMISSIONS->VENCIMENTO))) + "-" + ;
                                                    cvaltochar(Day2Str(stod(SQL_ITEMS_COMMISSIONS->VENCIMENTO))))
            oCommission[ 'invoice' ]          := ALLTRIM(SQL_ITEMS_COMMISSIONS->NF)

        aadd(aCommissions, oCommission)
        oCommission := JsonObject():New()

        SQL_ITEMS_COMMISSIONS->(DbSkip())
    EndDo
    SQL_ITEMS_COMMISSIONS->(DbCloseArea())

    oResponse['items'] := aCommissions

    return oResponse


method GetPayCnd(cId, cFilter) class TarosModel
    local oPayCondition  := JsonObject():New()
    local aPayConditions := {}
    local oResponse      := JsonObject():New()

    Default cId := ""
    Default cFilter := ""

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
            (
                UPPER(E4_CODIGO) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(E4_DESCRI) LIKE UPPER('%' || %Exp:cFilter% || '%')
            )
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

method GetPrTbl(cId, cFilter) class TarosModel
    local oPriceTable  := JsonObject():New()
    local aPriceTables := {}
    local oResponse    := JsonObject():New()

    Default cId := ""
    Default cFilter := ""

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
            (
                UPPER(DA0_CODTAB) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(DA0_DESCRI) LIKE UPPER('%' || %Exp:cFilter% || '%')
            )
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


method GetProds(cId, cFilter, cCustomerId) class TarosModel
    local oProduct  := JsonObject():New()
    local aProducts := {}
    local oResponse := JsonObject():New()

    Default cId := ""
    Default cFilter := ""
    Default cCustomerId := ""

    BeginSql Alias "SQL_SB1"
        SELECT
            B1_COD,
            B1_DESC
        FROM 
            %Table:SB1% SB1
        LEFT JOIN
            %Table:SA1% SA1 ON A1_FILIAL = %XFILIAL:SA1% AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:DA1% DA1 ON DA1_CODPRO = B1_COD AND DA1_CODTAB = A1_TABELA
        WHERE
            SB1.D_E_L_E_T_ = ''
            AND (
                SA1.A1_COD LIKE UPPER('%' || %Exp:cCustomerId% || '%')
            )
            AND (
                DA1_CODTAB = SA1.A1_TABELA
            )
            AND (
                %Exp:cId% = ''
                OR B1_COD = %Exp:cId%
            )        
            AND (
                %Exp:cFilter% = '' 
                OR (
                    UPPER(B1_DESC) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                    UPPER(B1_COD) LIKE UPPER('%' || %Exp:cFilter% || '%')
                )
            )
            AND
                SB1.B1_FILIAL = %XFILIAL:SB1%
            AND
                DA1.DA1_CODPRO != ''
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


method GetOps(cId, cFilter) class TarosModel
    local oOperation  := JsonObject():New()
    local aOperations := {}
    local oResponse   := JsonObject():New()

    Default cId := ""
    Default cFilter := ""

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
            (
                UPPER(X5_CHAVE) LIKE UPPER('%' || %Exp:cFilter% || '%') OR
                UPPER(X5_DESCRI) LIKE UPPER('%' || %Exp:cFilter% || '%')
            )
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

method GetSman(cSalesmanId) class TarosModel
    local oResponse     := JsonObject():New()
    local oSalesmanInfo := JsonObject():New()

    Default cSalesmanId := ""

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
        oSalesmanInfo[ 'name' ]           := Alltrim(SQL_SALESMAN->NOME)
        oSalesmanInfo[ 'code' ]           := Alltrim(SQL_SALESMAN->CODIGO)
        oSalesmanInfo[ 'cpf' ]            := Alltrim(SQL_SALESMAN->CPF)
        oSalesmanInfo[ 'email' ]          := Alltrim(SQL_SALESMAN->EMAIL)
        oSalesmanInfo[ 'phone' ]          := Alltrim(SQL_SALESMAN->TELEFONE)
        oSalesmanInfo[ 'cellPhone' ]      := Alltrim(SQL_SALESMAN->CELULAR)
        oSalesmanInfo[ 'adress' ]         := Alltrim(SQL_SALESMAN->ENDERECO)
        oSalesmanInfo[ 'city' ]           := Alltrim(SQL_SALESMAN->MUNICIPIO)
        oSalesmanInfo[ 'state' ]          := Alltrim(SQL_SALESMAN->ESTADO)
        oSalesmanInfo[ 'zipCode' ]        := Alltrim(SQL_SALESMAN->CEP)
        oSalesmanInfo[ 'commissionRate' ] := Alltrim(SQL_SALESMAN->COMISSAO)

    EndIf
    SQL_SALESMAN->(DbCloseArea())

    oResponse[ 'salesmanInfo' ] := oSalesmanInfo

    return oResponse

method GetSBudg(cSalesmanId, cFilter) class TarosModel
    local oResponse     := JsonObject():New()
    local oSalesBudget  := JsonObject():New()
    local aSalesBudgets := {}

    Default cSalesmanId := ""
    Default cFilter := ""

    BeginSql Alias "SQL_SALES_BUDGETS"
        SELECT
            CJ_FILIAL AS FILIAL,
            CJ_NUM AS NUMERO,
            CJ_EMISSAO AS EMISSAO,
            CJ_CLIENTE AS CODIGO_CLIENTE,
            CJ_LOJA AS LOJA,
            A1_NOME AS NOME_CLIENTE,
            CJ_EMISSAO AS DATA_EMISSAO,
            CJ_CONDPAG AS CONDICAO_PAGAMENTO,
            CJ_TPFRETE AS TIPO_FRETE,
            CJ_DESCONT AS DESCONTO,
            CJ_TABELA AS TABELA_PRECO,
            CJ_STATUS AS STATUS
        FROM
            %Table:SCJ% SCJ
        LEFT JOIN
            %Table:SA1% SA1 ON A1_COD = CJ_CLIENTE AND SA1.D_E_L_E_T_ = ''
        LEFT JOIN
            %Table:SE4% SE4 ON E4_CODIGO = CJ_CONDPAG AND SE4.D_E_L_E_T_ = ''
        WHERE
            SCJ.D_E_L_E_T_ = ''
        AND
            SA1.A1_VEND = %Exp:cSalesmanId%
        ORDER BY CJ_NUM DESC
    EndSql

    While !SQL_SALES_BUDGETS->(EoF())
        oSalesBudget[ 'orderNumber' ]      := ALLTRIM(SQL_SALES_BUDGETS->NUMERO)
        oSalesBudget[ 'branch' ]           := ALLTRIM(SQL_SALES_BUDGETS->FILIAL)
        oSalesBudget[ 'customerCode' ]     := ALLTRIM(SQL_SALES_BUDGETS->CODIGO_CLIENTE)
        oSalesBudget[ 'store' ]            := ALLTRIM(SQL_SALES_BUDGETS->LOJA)
        oSalesBudget[ 'customerName' ]     := ALLTRIM(SQL_SALES_BUDGETS->NOME_CLIENTE)
        oSalesBudget[ 'issueDate' ]        := IIF(EMPTY(SQL_SALES_BUDGETS->DATA_EMISSAO), '' , cvaltochar(year2Str(stod(SQL_SALES_BUDGETS->DATA_EMISSAO))) + "-" + cvaltochar(Month2Str(stod(SQL_SALES_BUDGETS->DATA_EMISSAO))) + '-' + cvaltochar(Day2Str(stod(SQL_SALES_BUDGETS->DATA_EMISSAO))))
        oSalesBudget[ 'paymentCondition' ] := ALLTRIM(SQL_SALES_BUDGETS->CONDICAO_PAGAMENTO)
        //oSalesBudget[ 'carrier' ]        := ALLTRIM(SQL_SALES_BUDGETS->TRANSPORTADORA)
        oSalesBudget[ 'shippingMethod' ]   := ALLTRIM(SQL_SALES_BUDGETS->TIPO_FRETE)
        oSalesBudget[ 'discount' ]         := SQL_SALES_BUDGETS->DESCONTO
        oSalesBudget[ 'priceTable' ]       := SQL_SALES_BUDGETS->TABELA_PRECO
        oSalesBudget[ 'status' ]           := Alltrim(SQL_SALES_BUDGETS->STATUS)
        //oSalesBudget[ 'message' ]        := Alltrim(SQL_SALES_BUDGETS->MSG_NOTA)
        oSalesBudget[ 'items' ]          := ::GetISBdg(SQL_SALES_BUDGETS->NUMERO)['items']

        aadd(aSalesBudgets, oSalesBudget)
        oSalesBudget := JsonObject():New()

        SQL_SALES_BUDGETS->(DbSkip())
    EndDo
    SQL_SALES_BUDGETS->(DbCloseArea())

    oResponse[ 'items' ] := aSalesBudgets

    return oResponse

method GetISBdg(cSalesRequestId) class TarosModel
    local oSalesRequest  := JsonObject():New()
    local aSalesRequests := {}
    local oResponse      := JsonObject():New()

    Default cSalesRequestId := ""

    BeginSql Alias "SQL_ITEMS_SALES_REQUESTS"
        SELECT
            CK_ITEM AS ITEM,
            CK_PRODUTO AS PRODUTO,
            B1_DESC AS DESC_PRODUTO,
            CK_QTDVEN AS QTDVEN,
            COUNT(*) OVER() AS TOTAL
        FROM
            %Table:SCK% SCK
        LEFT JOIN 
            %Table:SB1% SB1 ON B1_COD = CK_PRODUTO
        WHERE
            CK_NUM = %Exp:cSalesRequestId%
        AND
            SCK.D_E_L_E_T_ = ''
    EndSql

    oResponse['total'] := SQL_ITEMS_SALES_REQUESTS->TOTAL

    While !SQL_ITEMS_SALES_REQUESTS->(EoF())
        oSalesRequest[ 'CK_ITEM' ]    := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->ITEM)
        oSalesRequest[ 'CK_PRODUTO' ] := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->PRODUTO)
        oSalesRequest[ 'B1_DESC' ]    := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->DESC_PRODUTO)
        oSalesRequest[ 'CK_QTDVEN' ]  := SQL_ITEMS_SALES_REQUESTS->QTDVEN

        oSalesRequest[ 'C6_ITEM' ]    := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->ITEM)
        oSalesRequest[ 'C6_PRODUTO' ] := ALLTRIM(SQL_ITEMS_SALES_REQUESTS->PRODUTO)
        oSalesRequest[ 'C6_QTDVEN' ]  := SQL_ITEMS_SALES_REQUESTS->QTDVEN

        aadd(aSalesRequests, oSalesRequest)
        oSalesRequest := JsonObject():New()

        SQL_ITEMS_SALES_REQUESTS->(DbSkip())
    EndDo
    SQL_ITEMS_SALES_REQUESTS->(DbCloseArea())

    oResponse['items'] := aSalesRequests

    return oResponse

method GetImpts(cSalesmanId, cFilter) class TarosModel
    local oResponse := JsonObject():New()
    local oImport   := JsonObject():New()
    local aImports  := {}

    Default cSalesmanId := ""
    Default cFilter := ""

    BeginSql Alias "SQL_IMPORTS"
        SELECT DISTINCT
            Z00_DATA AS DATA,
            Z00_STATUS AS STATUS,
            Z00_CNPJ AS CNPJ, 
            Z00_TABELA AS TABELA, 
            E4_DESCRI AS CONDICAO_PAGAMENTO, 
            Z00_PDESC AS PERCENTUAL_DESCONTO, 
            Z00_PEDCOM AS PEDIDO_COMPRA, 
            Z00_EMISSA AS DATA_EMISSAO, 
            Z00_ARQUIV AS ARQUIVO,
            Z00_PV AS PEDIDO_VENDA,
            Z00_OBS AS OBSERVACOES
        FROM 
            %Table:Z00% Z00
        LEFT JOIN
            %Table:SE4% SE4 ON E4_CODIGO = Z00_CONDPG AND SE4.D_E_L_E_T_ = ''
        WHERE
            Z00_VENDED = %EXP:cSalesmanId%
        AND
            Z00.D_E_L_E_T_ = ''
    EndSql

    While !SQL_IMPORTS->(EoF())
        oImport[ 'date' ]             := IIF(EMPTY(SQL_IMPORTS->DATA), '' , ;
                                            cvaltochar(year2Str(stod(SQL_IMPORTS->DATA))) + "-" + ;
                                            cvaltochar(Month2Str(stod(SQL_IMPORTS->DATA))) + "-" + ;
                                            cvaltochar(Day2Str(stod(SQL_IMPORTS->DATA))))
        oImport[ 'status' ]           := Alltrim(SQL_IMPORTS->STATUS)
        oImport[ 'cnpj' ]             := Alltrim(SQL_IMPORTS->CNPJ)
        oImport[ 'priceTable' ]       := Alltrim(SQL_IMPORTS->TABELA)
        oImport[ 'paymentCondition' ] := Alltrim(SQL_IMPORTS->CONDICAO_PAGAMENTO)
        oImport[ 'discountPercent' ]  := SQL_IMPORTS->PERCENTUAL_DESCONTO
        oImport[ 'purchaseOrder' ]    := Alltrim(SQL_IMPORTS->PEDIDO_COMPRA)
        oImport[ 'issueDate' ]        := IIF(EMPTY(SQL_IMPORTS->DATA_EMISSAO), '' , ;
                                            cvaltochar(year2Str(stod(SQL_IMPORTS->DATA_EMISSAO))) + "-" + ;
                                            cvaltochar(Month2Str(stod(SQL_IMPORTS->DATA_EMISSAO))) + "-" + ;
                                            cvaltochar(Day2Str(stod(SQL_IMPORTS->DATA_EMISSAO))))
        oImport[ 'fileName' ]         := Alltrim(SQL_IMPORTS->ARQUIVO)
        oImport[ 'salesOrder' ]       := Alltrim(SQL_IMPORTS->PEDIDO_VENDA)
        oImport[ 'observation' ]      := Alltrim(SQL_IMPORTS->OBSERVACOES)

        aadd(aImports, oImport)
        oImport := JsonObject():New()

        SQL_IMPORTS->(DbSkip())
    EndDo
    SQL_IMPORTS->(DbCloseArea())

    oResponse[ 'items' ] := aImports

    return oResponse

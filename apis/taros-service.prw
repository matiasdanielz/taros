#include 'Totvs.ch'
#include 'RestFul.ch'

WSRESTFUL Taros Description "Taros"
    WSDATA id as string
    WSDATA filter as string
    WSDATA salesmanId as string
    WSDATA customerId as string
    WSDATA initialDate as string
    WSDATA endDate as string

    WSMETHOD POST login Description "Do Login" WSSYNTAX "/login" PATH "/login"
    WSMETHOD GET customers Description "Returns customers" WSSYNTAX "/customers" PATH "/customers"
    WSMETHOD GET invoices Description "Returns invoices" WSSYNTAX "/invoices" PATH "/invoices"
    WSMETHOD GET salesRequests Description "Returns salesRequests" WSSYNTAX "/salesRequests" PATH "/salesRequests"
    WSMETHOD GET commissions Description "Returns commissions" WSSYNTAX "/commissions" PATH "/commissions"
    WSMETHOD GET payConditions Description "Returns payment conditions" WSSYNTAX "/payConditions" PATH "/payConditions"
    WSMETHOD GET priceTables Description "Returns price tables" WSSYNTAX "/priceTables" PATH "/priceTables"
    WSMETHOD GET products Description "Returns products" WSSYNTAX "/products" PATH "/products"
    WSMETHOD GET operations Description "Returns operations" WSSYNTAX "/operations" PATH "/operations"
    WSMETHOD GET salesman Description "Returns salesman" WSSYNTAX "/salesman" PATH "/salesman"
    WSMETHOD GET salesBudgets Description "Returns sales budgets" WSSYNTAX "/salesBudgets" PATH "/salesBudgets"
    WSMETHOD GET imports Description "Returns imports" WSSYNTAX "/imports" PATH "/imports"
END WSRESTFUL

WSMETHOD POST login WSRECEIVE WSSERVICE Taros
    local jResponse := JsonObject():New()
    local oBody := JsonObject():New()

    oBody:FromJson(::GetContent())

    self:SetContentType('application/json')
    
    jResponse := TarosController():Login(oBody)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET customers WSRECEIVE salesmanId, filter, initialDate, endDate WSSERVICE Taros
    local jResponse    := JsonObject():New()
    local cSalesmanId  := self:salesmanId
    local cFilter      := self:filter
    local cInitialDate := self:initialDate
    local cEndDate     := self:endDate

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetCusts(cSalesmanId, cFilter, cInitialDate, cEndDate)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET invoices WSRECEIVE salesmanId, filter WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId
    local cFilter     := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetInvc(cSalesmanId, cFilter)

    self:setresponse(jResponse)
    return .t.


WSMETHOD GET salesRequests WSRECEIVE salesmanId, filter, initialDate, endDate WSSERVICE Taros
    local jResponse := JsonObject():New()
    local cSalesmanId := self:salesmanId
    local cFilter   := self:filter
    local cInitialDate := self:initialDate
    local cEndDate     := self:endDate

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetSReqs(cSalesmanId, cFilter, cInitialDate, cEndDate)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET commissions WSRECEIVE salesmanId, filter WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId
    local cFilter     := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetCommi(cSalesmanId, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET payConditions WSRECEIVE id, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local cId       := self:id
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetPayCnd(cId, cFilter)

    self:setresponse(jResponse)
    return .t.


WSMETHOD GET priceTables WSRECEIVE id, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local cId   := self:id
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetPrTbl(cId, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET products WSRECEIVE id, customerId, filter WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cId         := self:id
    local cFilter     := self:filter
    local cCustomerId := self:customerId

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetProds(cId, cFilter, cCustomerId)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET operations WSRECEIVE id, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local cId   := self:id
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetOps(cId, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET salesman WSRECEIVE salesmanId WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetSman(cSalesmanId)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET salesBudgets WSRECEIVE salesmanId, filter WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetSBudg(cSalesmanId, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET imports WSRECEIVE salesmanId, filter WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId
    local cFilter     := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetImpts(cSalesmanId, cFilter)

    self:setresponse(jResponse)
    return .t.

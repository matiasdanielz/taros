#include 'Totvs.ch'
#include 'RestFul.ch'

WSRESTFUL Taros Description "Taros"
    WSDATA page as integer
    WSDATA pageSize as integer
    WSDATA filter as string
    WSDATA salesmanId as string

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
END WSRESTFUL

WSMETHOD POST login WSRECEIVE WSSERVICE Taros
    local jResponse := JsonObject():New()
    local oBody := JsonObject():New()

    oBody:FromJson(::GetContent())

    self:SetContentType('application/json')
    
    jResponse := TarosController():Login(oBody)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET customers WSRECEIVE page, pageSize, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local nPage     := self:page
    local nPageSize := self:pageSize
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetCustomers(nPage, nPageSize, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET invoices WSRECEIVE page, pageSize, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local nPage     := self:page
    local nPageSize := self:pageSize
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetInvoices(nPage, nPageSize, cFilter)

    self:setresponse(jResponse)
    return .t.


WSMETHOD GET salesRequests WSRECEIVE page, pageSize, filter WSSERVICE Taros
    local jResponse := JsonObject():New()
    local nPage     := self:page
    local nPageSize := self:pageSize
    local cFilter   := self:filter

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetSalesRequests(nPage, nPageSize, cFilter)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET commissions WSRECEIVE salesmanId WSSERVICE Taros
    local jResponse := JsonObject():New()
    local cSalesmanId     := self:salesmanId

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetCommissions(cSalesmanId)

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET payConditions WSSERVICE Taros
    local jResponse := JsonObject():New()

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetPayConditions("", "")

    self:setresponse(jResponse)
    return .t.


WSMETHOD GET priceTables WSSERVICE Taros
    local jResponse := JsonObject():New()

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetPriceTables("", "")

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET products WSSERVICE Taros
    local jResponse := JsonObject():New()

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetProducts("", "")

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET operations WSSERVICE Taros
    local jResponse := JsonObject():New()

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetOperations("", "")

    self:setresponse(jResponse)
    return .t.

WSMETHOD GET salesman WSRECEIVE salesmanId WSSERVICE Taros
    local jResponse   := JsonObject():New()
    local cSalesmanId := self:salesmanId

    self:SetContentType('application/json')
    
    jResponse := TarosController():GetSalesman(cSalesmanId)

    self:setresponse(jResponse)
    return .t.


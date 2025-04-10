#include 'protheus.ch'
#include 'topconn.ch'
#Include "Totvs.ch"
#Include "parmtype.ch"
#Include "tbiconn.ch"

class TarosController from longclassname
    static method Login()
    static method GetCustomers()
    static method GetInvoices()
    static method GetSalesRequests()
    static method GetCommissions()
    static method GetPayConditions()
    static method GetPriceTables()
    static method GetProducts()
    static method GetOperations()
    static method GetSalesman()
endclass

static method Login(oLoginInfo) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:Login(oLoginInfo['user'], oLoginInfo['password'])

    return oJsonResult

static method GetCustomers(nPage, nPageSize, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetCustomers(nPage, nPageSize, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No customers found'
    endif

    return oJsonResult


static method GetInvoices(nPage, nPageSize, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetInvoices(nPage, nPageSize, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No invoices found'
    endif

    return oJsonResult


static method GetSalesRequests(nPage, nPageSize, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetSalesRequests(nPage, nPageSize, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No sales requests found'
    endif

    return oJsonResult


static method GetCommissions(cSalesmanId) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetCommissions(cSalesmanId)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No commissions found'
    endif

    return oJsonResult

static method GetPayConditions(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetPayConditions(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetPriceTables(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetPriceTables(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetProducts(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetProducts(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult


static method GetOperations(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetOperations(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetSalesman(cSalesmanId) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetSalesman(cSalesmanId)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

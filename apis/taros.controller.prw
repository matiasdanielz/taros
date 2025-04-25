#include 'protheus.ch'
#include 'topconn.ch'
#Include "Totvs.ch"
#Include "parmtype.ch"
#Include "tbiconn.ch"

class TarosController from longclassname
    static method Login()
    static method GetCusts()
    static method GetInvc()
    static method GetSReqs()
    static method GetCommi()
    static method GetPayCnd()
    static method GetPrTbl()
    static method GetProds()
    static method GetOps()
    static method GetSman()
    static method GetSBudg()
    static method GetImpts()
endclass

static method Login(oLoginInfo) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:Login(oLoginInfo['user'], oLoginInfo['password'])

    return oJsonResult

static method GetCusts(cSalesmanId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetCusts(cSalesmanId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No customers found'
    endif

    return oJsonResult


static method GetInvc(cSalesmanId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetHInvc(cSalesmanId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No invoices found'
    endif

    return oJsonResult


static method GetSReqs(cSalesmanId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetSReqs(cSalesmanId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No sales requests found'
    endif

    return oJsonResult


static method GetCommi(cSalesmanId) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetHComm(cSalesmanId)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No commissions found'
    endif

    return oJsonResult

static method GetPayCnd(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetPayCnd(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetPrTbl(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetPrTbl(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetProds(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetProds(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult


static method GetOps(cId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetOps(cId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetSman(cSalesmanId) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetSman(cSalesmanId)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetSBudg(cSalesmanId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetSBudg(cSalesmanId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

static method GetImpts(cSalesmanId, cFilter) class TarosController
    local oJsonResult := JsonObject():New()
    local oTarosModel := JsonObject():New()

    oTarosModel := TarosModel():New()

    oJsonResult := oTarosModel:GetImpts(cSalesmanId, cFilter)
    
    if oJsonResult == nil
        oJsonResult['responseCode'] := '404'
        oJsonResult['response'] := 'No pay conditions found'
    endif

    return oJsonResult

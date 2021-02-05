const repl = require('repl');

const r = repl.start({ prompt: '> ', eval: myEval }).setupHistory("./log.txt", myHistoryWrite);

const stock = new Map();
const warehouse = new Map();
const product = new Map();
let cmdHistory = [];

function processCmd(cmd) {
    cmd=cmd.trim();
    cmdHistory.push(cmd);
    let args = cmd.split(" ");
    let res = "";
    if (args[0]=="ADD" && args[1] == "PRODUCT") {
        let name = args.slice(2,args.length-1).join(" ");
        let SKU = args[args.length-1];
        if (!product.has(SKU)) {
            product.set(SKU,name);
        } else {
            res = "ERROR ADDING PRODUCT PRODUCT with SKU "+SKU;
        }
    } else if (args[0]=="ADD" && args[1] == "WAREHOUSE") {
        let warehouseNumber = args[2];
        if (!warehouse.has(warehouseNumber)) {
            if (args.length==4) {
                let stockLimit = args[3];
                warehouse.set(warehouseNumber,stockLimit);
            } else {
                warehouse.set(warehouseNumber,"-1");
            }
        } else {
            res = "ERROR ADDING WAREHOUSE WAREHOUSE WITH WAREHOUSE# " + warehouseNumber;
        }
    } else if (args[0]=="STOCK") {
        let SKU = args[1];
        let warehouseNumber = args[2];
        let quantity = args[3];
        if (!warehouse.has(warehouseNumber)) {
            res = "WRONG WAREHOUSE# "+warehouseNumber;
        } else if (!product.has(SKU)) {
            res = "WRONG SKU "+SKU;
        } else {
            if (stock.has(warehouseNumber)) {
                let curWarehouse = stock.get(warehouseNumber);
                let addStockAmount = 0;
                let currentStockSum = 0;
                let limit = parseInt(warehouse.get(warehouseNumber));
                for (let num of curWarehouse.values()) {
                    currentStockSum += parseInt(num);
                }
                if (warehouse.get(warehouseNumber)!="-1" && (currentStockSum + parseInt(quantity)) > limit) {
                    addStockAmount = (limit - currentStockSum);
                    res = "REACH STOCK LIMIT, ADD ONLY "+addStockAmount.toString();
                } else {
                    addStockAmount = parseInt(quantity);
                }
                if (curWarehouse.has(SKU)) {
                    curWarehouse.set(SKU,(parseInt(curWarehouse.get(SKU)) + addStockAmount).toString());
                } else {
                    curWarehouse.set(SKU,(addStockAmount).toString());
                }
                stock.set(warehouseNumber,curWarehouse);
            } else {
                let curWarehouse = new Map();
                curWarehouse.set(SKU,quantity);
                stock.set(warehouseNumber,curWarehouse);
            }
            // console.log(stock);
        }
    } else if (args[0]=="UNSTOCK") {
        let SKU = args[1];
        let warehouseNumber = args[2];
        let quantity = parseInt(args[3]);
        if (stock.has(warehouseNumber)) {
            let curWarehouse = stock.get(warehouseNumber);
            if (curWarehouse.has(SKU)) {
                if (parseInt(curWarehouse.get(SKU))>parseInt(quantity)) {
                    curWarehouse.set(SKU,(parseInt(curWarehouse.get(SKU)) - parseInt(quantity)).toString());
                } else {
                    res = "STOCK EMPTYED, UNSTOCKED ITEMS: " + curWarehouse.get(SKU);
                    curWarehouse.set(SKU,"0");
                }
            } else {
                res = "NO STOCK OF PRODUCT SKU "+SKU;
            }
            stock.set(warehouseNumber,curWarehouse);
        } else {
            res = "NO STOCK IN WAREHOUSE# "+warehouseNumber;
        }
        // console.log(stock);
    } else if (args[0]=="LIST" && args[1] == "PRODUCTS") {
        for (let key of product.keys()) {
            console.log(product.get(key) + " " + key);
        }
    } else if (args[0]=="LIST" && args[1] == "WAREHOUSES") {
        console.log("WAREHOUSES");
        for (let key of warehouse.keys()) {
            console.log(key);
        }
    } else if (args[0]=="LIST" && args[1] == "WAREHOUSE") {
        let warehouseNumber = args[2];
        if (stock.has(warehouseNumber)) {
            console.log("ITEM NAME     ITEM_SKU     QTY");
            let warehouseProduct = stock.get(warehouseNumber);
            for (let key of warehouseProduct.keys()) {
                console.log(product.get(key) + "     " + key + "     " + warehouseProduct.get(key));
            }
        }
    } else {
        res = "UNRECOGNISED COMMAND";
    }
    return res;
}

function myEval(cmd, context, filename, callback) {
  callback(null, processCmd(cmd));
}

function myHistoryWrite(path, callback) {
    if (cmdHistory.length==2) {
        fs.writeFile(path, cmdHistory[0], function (err) {
            if (err) return console.log(err);
            console.log('error > ' + path);
          });
        fs.writeFile(path, cmdHistory[1], function (err) {
            if (err) return console.log(err);
            console.log('error > ' + path);
          });
        cmdHistory = [];
    }
}

# Prerequisite
"node.js" installed;

"repl" library installed by command "npm install repl";
# Execution
1. Open the comman line prompt, type "node app.js" to enter the REPL interface of this customered program;
2. Type the command follow the given rule, like below command:(need to be in uppercase)
>ADD PRODUCT "PRODUCT NAME" SKU

>ADD WAREHOUSE WAREHOUSE# [STOCK_LIMIT]

>STOCK SKU WAREHOUSE# QTY

>UNSTOCK SKU WAREHOUSE# QTY

>LIST PRODUCTS

>LIST WAREHOUSES

>LIST WAREHOUSE WAREHOUSE#

# Command History
The command history is stored in the file "log.txt", the top record is the most recent command.
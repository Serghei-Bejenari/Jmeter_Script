/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.8320047239445, "KoPercent": 13.167995276055507};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.817832890463537, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3333333333333333, 500, 1500, "Shipping Method"], "isController": false}, {"data": [0.9841269841269841, 500, 1500, "Payment method save "], "isController": false}, {"data": [1.0, 500, 1500, "Acces Shopping Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Remove product from cart"], "isController": false}, {"data": [0.9841269841269841, 500, 1500, "Shipping Address"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "Checkout confirm"], "isController": false}, {"data": [0.967741935483871, 500, 1500, "Confirm"], "isController": false}, {"data": [0.7305389221556886, 500, 1500, "Access product"], "isController": false}, {"data": [0.32934131736526945, 500, 1500, "Succesful login"], "isController": false}, {"data": [0.6031746031746031, 500, 1500, "Checkout"], "isController": false}, {"data": [0.9951923076923077, 500, 1500, "Logout "], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "Payment Method"], "isController": false}, {"data": [0.7425149700598802, 500, 1500, "Access product category"], "isController": false}, {"data": [0.8387096774193549, 500, 1500, "Checkout Success"], "isController": false}, {"data": [0.9273570324574961, 500, 1500, "Access HomePage"], "isController": false}, {"data": [0.6287425149700598, 500, 1500, "Access Login"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout country"], "isController": false}, {"data": [1.0, 500, 1500, "Checkout Payment Address"], "isController": false}, {"data": [0.9970059880239521, 500, 1500, "Adding to Shopping Cart"], "isController": false}, {"data": [1.0, 500, 1500, "Shipping method save"], "isController": false}, {"data": [0.9851485148514851, 500, 1500, "Succesful login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Succesful login-0"], "isController": false}, {"data": [1.0, 500, 1500, "Enter credentials-1"], "isController": false}, {"data": [0.9855769230769231, 500, 1500, "Access Shopping Cart"], "isController": false}, {"data": [0.9903846153846154, 500, 1500, "Continue logout"], "isController": false}, {"data": [1.0, 500, 1500, "Access Login-0"], "isController": false}, {"data": [0.8064516129032258, 500, 1500, "Access Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "Enter credentials-0"], "isController": false}, {"data": [1.0, 500, 1500, "Logout -0"], "isController": false}, {"data": [0.2826086956521739, 500, 1500, "Enter credentials"], "isController": false}, {"data": [1.0, 500, 1500, "Logout -1"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3387, 446, 13.167995276055507, 322.8278712725121, 0, 1971, 305.0, 523.6000000000008, 615.5999999999999, 821.0, 0.9410785365742519, 15.360101606422035, 0.6497298375937953], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["Shipping Method", 63, 42, 66.66666666666667, 177.4285714285714, 122, 456, 168.0, 211.4, 251.7999999999999, 456.0, 0.017769113219712546, 0.0154496423860196, 0.009648073193515797], "isController": false}, {"data": ["Payment method save ", 63, 1, 1.5873015873015872, 203.4126984126984, 125, 470, 188.0, 269.8, 309.79999999999995, 470.0, 0.01776713379187579, 0.0050297799547530326, 0.012718075263129841], "isController": false}, {"data": ["Acces Shopping Cart", 167, 0, 0.0, 213.6107784431137, 125, 468, 182.0, 359.80000000000007, 394.3999999999999, 463.91999999999996, 0.04685935683147692, 0.19290765877956348, 0.026175343855082807], "isController": false}, {"data": ["Remove product from cart", 104, 0, 0.0, 167.08653846153845, 115, 472, 160.5, 190.0, 263.75, 463.6000000000005, 0.02917724926432652, 0.010713795189316862, 0.019774424794377545], "isController": false}, {"data": ["Shipping Address", 63, 0, 0.0, 344.9841269841271, 190, 637, 341.0, 449.0, 486.19999999999993, 637.0, 0.01776785535499188, 0.599954308585061, 0.009664741633525856], "isController": false}, {"data": ["Checkout confirm", 63, 43, 68.25396825396825, 250.71428571428564, 152, 717, 231.0, 297.8, 526.5999999999999, 717.0, 0.01776638222594721, 0.0193884679047485, 0.00950779048810456], "isController": false}, {"data": ["Confirm", 62, 1, 1.6129032258064515, 229.67741935483866, 120, 519, 164.5, 397.3, 443.2499999999998, 519.0, 0.01777565744129159, 0.008249184022063604, 0.010224474836836667], "isController": false}, {"data": ["Access product", 167, 31, 18.562874251497007, 348.3652694610779, 0, 1117, 370.0, 554.2, 600.2, 827.3199999999971, 0.046854636995804125, 1.2173624223707042, 0.02571733449721748], "isController": false}, {"data": ["Succesful login", 167, 101, 60.47904191616767, 454.88622754491, 241, 1100, 435.0, 580.2000000000002, 670.0, 952.4399999999985, 0.04684909010370481, 1.0351085209552893, 0.05013138653739497], "isController": false}, {"data": ["Checkout", 63, 0, 0.0, 648.4444444444443, 363, 1005, 667.0, 827.2, 878.0, 1005.0, 0.017760972827685014, 1.0140936777315177, 0.011343433817681641], "isController": false}, {"data": ["Logout ", 104, 0, 0.0, 309.0576923076924, 236, 511, 300.5, 376.0, 457.0, 510.25000000000006, 0.029175301199918423, 0.5329705866500835, 0.01903807848450581], "isController": false}, {"data": ["Payment Method", 63, 1, 1.5873015873015872, 266.61904761904754, 154, 1258, 261.0, 335.8, 354.0, 1258.0, 0.01776657762697181, 0.019354531598281325, 0.009629346272431009], "isController": false}, {"data": ["Access product category", 167, 0, 0.0, 531.2395209580837, 293, 1971, 506.0, 692.4000000000001, 725.6, 1333.8399999999936, 0.046852967532296286, 2.0172185050214035, 0.030234915203142684], "isController": false}, {"data": ["Checkout Success", 62, 0, 0.0, 437.2903225806453, 279, 678, 405.5, 582.9000000000001, 649.8999999999996, 678.0, 0.017777160993123965, 0.4177011215166441, 0.011405854270002388], "isController": false}, {"data": ["Access HomePage", 647, 0, 0.0, 396.5285935085009, 242, 1551, 366.0, 534.2, 619.0, 948.0799999999999, 0.17979608844855982, 4.37998792160029, 0.11232099329835785], "isController": false}, {"data": ["Access Login", 167, 62, 37.125748502994014, 416.688622754491, 232, 1153, 324.0, 681.2000000000004, 760.8, 1104.0399999999995, 0.04684496364746668, 1.0258238384622957, 0.04112165347784584], "isController": false}, {"data": ["Checkout country", 63, 0, 0.0, 178.44444444444449, 115, 446, 162.0, 237.2, 264.99999999999994, 446.0, 0.01776118313161234, 0.16786399448021896, 0.010372253430375174], "isController": false}, {"data": ["Checkout Payment Address", 63, 0, 0.0, 331.9523809523811, 207, 458, 340.0, 405.0, 433.79999999999995, 458.0, 0.01775913538380874, 0.5885477449421701, 0.009642655540427404], "isController": false}, {"data": ["Adding to Shopping Cart", 167, 0, 0.0, 217.88622754491016, 130, 556, 198.0, 302.0, 326.59999999999997, 501.59999999999945, 0.04685688504406792, 0.027258745174722872, 0.03357179854892364], "isController": false}, {"data": ["Shipping method save", 63, 0, 0.0, 210.17460317460322, 130, 301, 206.0, 275.2, 288.4, 301.0, 0.017768211147268013, 0.00676333384381686, 0.012718846456003371], "isController": false}, {"data": ["Succesful login-1", 101, 0, 0.0, 314.5940594059406, 234, 684, 303.0, 392.4, 438.4999999999999, 681.8200000000004, 0.029182409998991618, 0.5695984654783647, 0.018694981405604005], "isController": false}, {"data": ["Succesful login-0", 101, 0, 0.0, 133.58415841584159, 93, 273, 128.0, 162.8, 169.7, 272.90000000000003, 0.029184383176503393, 0.010745769799509067, 0.01992176156286706], "isController": false}, {"data": ["Enter credentials-1", 4, 0, 0.0, 348.25, 313, 400, 340.0, 400.0, 400.0, 400.0, 0.05806105119533189, 1.1965736268561393, 0.039066469017171555], "isController": false}, {"data": ["Access Shopping Cart", 104, 1, 0.9615384615384616, 160.9326923076923, 119, 564, 156.5, 183.5, 199.25, 548.5500000000009, 0.029179254896503425, 0.020708185338630863, 0.016299349414843713], "isController": false}, {"data": ["Continue logout", 104, 0, 0.0, 308.13461538461524, 228, 593, 300.0, 377.0, 408.0, 590.3000000000002, 0.029174302713125995, 0.5326589487544957, 0.018518844495636618], "isController": false}, {"data": ["Access Login-0", 62, 0, 0.0, 151.12903225806448, 103, 231, 151.0, 177.4, 201.79999999999995, 231.0, 0.017780709364267944, 0.006580946141657764, 0.011547042702381037], "isController": false}, {"data": ["Access Login-1", 62, 0, 0.0, 454.53225806451604, 240, 982, 446.0, 637.8000000000002, 693.6999999999998, 982.0, 0.017778771859645198, 0.45807108748732905, 0.010938111593336403], "isController": false}, {"data": ["Enter credentials-0", 65, 0, 0.0, 210.73846153846156, 105, 467, 206.0, 279.4, 297.29999999999995, 467.0, 0.018329055613738557, 0.0067957397000576935, 0.02007081157462943], "isController": false}, {"data": ["Logout -0", 3, 0, 0.0, 143.66666666666666, 134, 157, 140.0, 157.0, 157.0, 157.0, 0.0431673309639265, 0.01593481553160568, 0.027401137818898656], "isController": false}, {"data": ["Enter credentials", 230, 163, 70.8695652173913, 299.45217391304357, 22, 819, 296.0, 415.9, 473.9, 675.2599999999999, 0.06419823521842613, 0.5668683453644549, 0.06454032415014796], "isController": false}, {"data": ["Logout -1", 3, 0, 0.0, 307.6666666666667, 294, 315, 314.0, 315.0, 315.0, 315.0, 0.04307126859243095, 0.7855038485973124, 0.026540986798656175], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["[]", 1, 0.2242152466367713, 0.029524653085326247], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 172.23.176.132:80 failed to respond", 36, 8.071748878923767, 1.0628875110717448], "isController": false}, {"data": ["E-mail address", 62, 13.90134529147982, 1.8305284912902273], "isController": false}, {"data": ["Your shopping cart is empty!", 1, 0.2242152466367713, 0.029524653085326247], "isController": false}, {"data": ["My Account", 97, 21.748878923766817, 2.863891349276646], "isController": false}, {"data": ["Cash On Delivery", 1, 0.2242152466367713, 0.029524653085326247], "isController": false}, {"data": ["Test failed: text expected to contain \\\/{&quot;redirect&quot;:&quot;http:\\\\\\\/\\\\\\\/172.23.176.132\\\\\\\/opencart\\\\\\\/upload\\\\\\\/index.php?route=checkout\\\\\\\/success&quot;}\\\/", 1, 0.2242152466367713, 0.029524653085326247], "isController": false}, {"data": ["Test failed: text expected to contain \\\/Logout\\\/", 101, 22.6457399103139, 2.981989961617951], "isController": false}, {"data": ["Response was null", 61, 13.67713004484305, 1.8010038382049012], "isController": false}, {"data": ["Confirm Order", 43, 9.641255605381167, 1.2695600826690285], "isController": false}, {"data": ["Please select the preferred shipping method to use on this order.", 42, 9.417040358744394, 1.2400354295837024], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3387, 446, "Test failed: text expected to contain \\\/Logout\\\/", 101, "My Account", 97, "E-mail address", 62, "Response was null", 61, "Confirm Order", 43], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Shipping Method", 63, 42, "Please select the preferred shipping method to use on this order.", 42, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Payment method save ", 63, 1, "[]", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Checkout confirm", 63, 43, "Confirm Order", 43, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Confirm", 62, 1, "Test failed: text expected to contain \\\/{&quot;redirect&quot;:&quot;http:\\\\\\\/\\\\\\\/172.23.176.132\\\\\\\/opencart\\\\\\\/upload\\\\\\\/index.php?route=checkout\\\\\\\/success&quot;}\\\/", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Access product", 167, 31, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 172.23.176.132:80 failed to respond", 31, null, null, null, null, null, null, null, null], "isController": false}, {"data": ["Succesful login", 167, 101, "Test failed: text expected to contain \\\/Logout\\\/", 101, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Payment Method", 63, 1, "Cash On Delivery", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Access Login", 167, 62, "E-mail address", 62, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Access Shopping Cart", 104, 1, "Your shopping cart is empty!", 1, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Enter credentials", 230, 163, "My Account", 97, "Response was null", 61, "Non HTTP response code: org.apache.http.NoHttpResponseException\/Non HTTP response message: 172.23.176.132:80 failed to respond", 5, null, null, null, null], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

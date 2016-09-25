// var api_key = "1d8849cbf874b8e5a4d2431bc879359b";
// var base_url = 'http://api.reimaginebanking.com';
//
// var normalizations = {
//     "bills": {
//         11: 0.9,
//         0 : 0.9,
//         1 : 0.9,
//         5 : 0.9,
//         6 : 0.9,
//         7 : 0.9
//     }
// }
//
// function ApiCall(url) {
//     return $.ajax({
//         url: url,
//         async: false
//     });
// }
//
// function SumProperty(data_array, property, date_type) {
//     var year_ago = GetYearAgo();
//     var total = 0.0;
//     var months = [0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0,0.0];
//     for (var i = 0; i < data_array.length; i++) {
//         if (data_array[i]["medium"] == "balance") {
//             date = new Date(data_array[i][date_type] + " 04:00:00");
//             if (date >= year_ago) {
//                 var month = date.getMonth();
//                 months[month] += parseFloat(data_array[i][property]);
//                 total += parseFloat(data_array[i][property]);
//             }
//         }
//     }
//     return { "months": months, "total": total };
// }
//
// function SumBills(bills) {
//     var year_ago = GetYearAgo();
//     var today  =new Date;
//     var total = 0.0;
//     var months = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
//     for (var i = 0; i < bills.length; i++) {
//         date = new Date(bills[i]["payment_date"] + " 04:00:00");
//         if (date > year_ago && date <= today) {
//             if (bills[i]["status"] == "completed") {
//                 var month = date.getMonth();
//                 var multiplier = 1.0;
//                 if (normalizations["bills"][month]) {
//                     multiplier = normalizations["bills"][month];
//                 }
//                 months[month] += (parseFloat(bills[i]["payment_amount"]) * multiplier);
//                 total += (parseFloat(bills[i]["payment_amount"])* multiplier);
//             }
//         }
//     }
//     return { "months": months, "total": total };
// }
//
// function GetCategories(purchases, merchants) {
//     var year_ago = GetYearAgo();
//     var categories = new Array();
//     for (var i = 0; i < purchases.length; i++) {
//         date = new Date(purchases[i]["purchase_date"] + " 04:00:00");
//         if (date > year_ago) {
//             for (var j = 0; j < merchants.length; j++) {
//                 if (purchases[i]["merchant_id"] == merchants[j]["_id"]) {
//                     if (!categories[merchants[j]["category"]]) {
//                         categories[merchants[j]["category"]] = 0;
//                     }
//                     categories[merchants[j]["category"]] += purchases[i]["amount"];
//                 }
//             }
//         }
//     }
//     return categories;
// }
//
// function GetAverageIncome(positives, negatives) {
//     var net = positives["total"];
//     for (var i = 0; i < negatives.length; i++) {
//         net -= negatives[i]["total"];
//     }
//     var income = net / 12.0;
//     return income;
// }
//
// function GetNetMonthlyIncome(positives, negatives) {
//     var per_month = new Array(12);
//     for (var i = 0; i < 12; i++) {
//         per_month[i] = positives["months"][i];
//     }
//     for (var i = 0; i < negatives.length; i++) {
//         for (var j = 0; j < 12; j++) {
//             per_month[j] -= negatives[i]["months"][j];
//         }
//     }
//     return per_month;
// }
//
// function GetAccount(all_accounts, account_number) {
//     for (var i = 0; i < all_accounts.length; i++) {
//         if (all_accounts[i]["account_number"] == account_number) {
//             return all_accounts[i]["_id"];
//         }
//     }
// }
//
// function GetName(results) {
//     var full_name = results["first_name"];
//     return full_name;
// }
//
// function GetYearAgo() {
//     var today = new Date;
//     var last_year = today.getFullYear() - 1;
//     var todays_month = today.getMonth();
//     var todays_day = today.getDate();
//     return  new Date(last_year, todays_month, todays_day);
// }
//
// var ProcessApiCalls = function (account_number) {
//     var all_purchases, all_withdrawals, all_deposits, all_bills, all_categories = {};
//
//     var merchants_url = base_url + '/merchants?key=' + api_key;
//     var merchants = new Array();
//     var mer_promise= ApiCall(merchants_url);
//     mer_promise.done(function (results) {
//         for (var i = 0; i < results.length; i++) {
//             if(results[i]["category"] && results[i]["category"] != "A" && results[i]["category"] != "test") {
//                 merchants.push(results[i]);
//             }
//         }
//     })
//     var all_accounts_url = base_url + '/accounts?key=' + api_key;
//     var promise = ApiCall(all_accounts_url);
//     var chequing_account_id = '';
//     promise.done(function (results) {
//         chequing_account_id = GetAccount(results, account_number);
//     })
//
//     var name = "";
//     var customer_url = base_url + '/accounts/'+ chequing_account_id + '/customer?key=' + api_key;
//     var customer = ApiCall(customer_url);
//     customer.done(function (results) {
//         window.name = GetName(results);
//     })
//
//     var purchases_url = base_url + '/accounts/' + chequing_account_id + '/purchases?key=' + api_key;
//     var purchases = ApiCall(purchases_url);
//     purchases.done(function (results) {
//         all_purchases = SumProperty(results, "amount","purchase_date");
//         all_categories = GetCategories(results, merchants);
//     })
//     var withdrawals_url = base_url + '/accounts/' + chequing_account_id + '/withdrawals?key=' + api_key;
//     var withdrawals = ApiCall(withdrawals_url);
//     withdrawals.done(function (results) {
//         all_withdrawals = SumProperty(results, "amount","transaction_date");
//         all_categories["withdrawals"] = all_withdrawals["total"];
//         console.log(all_categories)
//     })
//
//     var deposits_url = base_url + '/accounts/' + chequing_account_id + '/deposits?key=' + api_key;
//     var deposits = ApiCall(deposits_url);
//     deposits.done(function (results) {
//         all_deposits = SumProperty(results, "amount", "transaction_date");
//     })
//
//     var bills_url = base_url + '/accounts/' + chequing_account_id + '/bills?key=' + api_key;
//     var bills = ApiCall(bills_url);
//     bills.done(function (results) {
//         all_bills = SumBills(results);
//         all_categories["bills"] = all_bills["total"];
//     })
//
//     var average_monthly_income = GetAverageIncome(all_deposits, [all_purchases, all_withdrawals, all_bills]);
//     var net_income_per_month = GetNetMonthlyIncome(all_deposits, [all_purchases, all_withdrawals, all_bills])
//     var total_expenses = (all_purchases["total"] + all_withdrawals["total"] + all_bills["total"]);
//     window.final_chart_data = {
//         "income": all_deposits["total"],
//         "expenses": total_expenses,
//         "net_income": all_deposits["total"] - total_expenses
//     };
//
//     window.data = {
//         labels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
//         datasets: [
//             {
//                 label: "Net Monthly Income",
//                 fill: false,
//                 lineTension: 0,
//                 backgroundColor: "#da253d",
//                 borderColor: "#da253d",
//                 borderCapStyle: 'butt',
//                 borderDash: [],
//                 borderDashOffset: 0.0,
//                 borderJoinStyle: 'miter',
//                 pointBorderColor: "#da253d",
//                 pointBackgroundColor: "#fff",
//                 pointBorderWidth: 1,
//                 pointHoverRadius: 5,
//                 pointHoverBackgroundColor: "#da253d",
//                 pointHoverBorderColor: "rgba(220,220,220,1)",
//                 pointHoverBorderWidth: 2,
//                 pointRadius: 1,
//                 pointHitRadius: 10,
//                 data: net_income_per_month,
//                 spanGaps: false,
//             }
//         ]
//     };
//
//     var keys = Object.keys(all_categories);
//     var values = [];
//     console.log(all_categories)
//
//     console.log(keys)
//     for (var i = 0; i < keys.length; i++) {
//         values.push(all_categories[keys[i]])
//     }
//
//     console.log(values)
//     window.data2 = {
//         labels: keys,
//         datasets: [
//             {
//                 data: values,
//                 backgroundColor: [
//                     "#da253d",
//                     "#56AEE2",
//                     "#e2cf56",
//                     "#56E289",
//                     "#8A56E2",
//                     "#E28956"
//                 ],
//                 hoverBackgroundColor: [
//                     "#E25668",
//                     "#2598da",
//                     "#ffff80",
//                     "#25da67",
//                     "#6725da",
//                     "#da6725"
//                 ]
//             }]
//     };
//
//     var ctx2 = $("#pieChart");
//       var myDoughnutChart = new Chart(ctx2, {
//           type: 'doughnut',
//           data: window.data2,
//           options: {
//
//           }
//       });
//
//
//     return average_monthly_income;
// };

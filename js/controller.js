var app = angular.module("myApp",[]);

app.controller("myCtrl",function($scope,$http){
    $scope.showgetbutton = true;  //initialize boolean to show get account number to true as default
    $scope.showqrgen = true; // boolean to show / hide generate qr button

    $scope.currentbatch = 0;  //default value for newly created accounts, will be updated if there is existing account in db later on
    $scope.recordID = 1;   // default value for first account (if no accounts yet)

    var qrcode = new QRCode(document.getElementById("qrcode"));   //initialize QR object

    $http.get('getLast.php') // performs a GET request to check if there are any account in db yet / obtains most recent account's information
        .then(
            function(response){
                if(response.data== "No data yet"){  // if no data

                    console.log('db no data');
                    $scope.password = document.results.text.value;   //get password from a generated secret phrase using javascrypt (hidden div), https://www.fourmilab.ch/javascrypt/pass_phrase.html

                    $scope.password = $scope.password.trim(); // remove whitespace
                    $scope.showqrgen = false; // hides qr generation button as there is no account

                }
                else{  // if there are existing account
                    // console.log(response.data.accs[0].numberOfBatches);
                    //console.log(response.data.accs[0])

                    if(response.data.accs[0].numberOfBatches <100)  //information regarding the last account (most recent one will be retrieved)
                                                                    //each account is supposed to carry 100 batches, if not yet reach 100, the information will be used for the next qr generation
                    {
                        $scope.password = response.data.accs[0].secretPhrase;  //obtains secret phrase required for transaction for this particular account
                        $scope.accNum = response.data.accs[0].nxtAccountNumber;  //obtains nxt account number which is also required for qr generation / transaction
                        $scope.showgetbutton = false; // hides get account number button, only shown when there is no existing account / a new account needs to be generated

                        $scope.currentbatch = parseInt(response.data.accs[0].numberOfBatches); // obtains the current number of batches for this particular account
                        $scope.recordID = response.data.accs[0].recordID; // obtains the record id of current account
                    }
                    else{ // if most recent account has 100 account (max)
                        $scope.password = document.results.text.value; //get password from a generated secret phrase using javascrypt (hidden div), https://www.fourmilab.ch/javascrypt/pass_phrase.html
                        $scope.showqrgen = false; // hide generate qr button
                        $scope.recordID = parseInt(response.data.accs[0].recordID) + 1;

                    }

                }
            },
            function(response){  //display error to user if something goes wrong
                alert("Get Last account error, please contact with your system administrator, and check the browser's console for more information");
                console.log(response);
            }
        );



    $scope.makeAccount = (pass)=>{  // recieves secret phrase generated in textbox

          $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountId&secretPhrase='+encodeURIComponent(pass))  // NXT blockchain api call to get nxt account number using secret phrase
            .then(
                function(response){

                    $scope.checkAccount(response.data.accountRS); // pass returned account number for checking if account already exists

                },
                function(response){ // error alert
                    alert("ERROR in making account,please contact your system administrator,and check the browser's console for more information");
                    console.log(response);
                }
            );
    }

    $scope.checkAccount = (accNumber)=>{ // to check if account already exited before this (if generated password is by some coincedence some people's account)
        //change accNum to NXT-2N9Y-MQ6D-WAAS-G88VH to test this function. Empty database or make sure the last account in the database has 100 batches to test this (condition to make new account).

        $http.get('http://174.140.168.136:6876/nxt?requestType=getAccountPublicKey&account='+encodeURIComponent(accNumber)) //blockchain api call to get account's public key
        .then(
            function(response){
                if(response.data.hasOwnProperty('publicKey')){ // if response contains public key, it means it might be someone else's account (only an account which has made a valid)
                                                                // transaction on the blockchain has a public key. A new acccount that we created does not have one.

                    alert('Generated account has existed, the page will now refresh. Please try again'); // alert the user for page reload
                    location.reload();
                }
                else{  // if no public key, then new account creation is successful
                    $scope.accNum = accNumber;
                    $scope.addToDB();  // add generated account details to db
                    //$scope.showqrgen = true; // show qr generation button after added to db
                }
            },
            function(response){
                alert("ERROR in checking account, contact your system administrator and check console for more information");
                console.log(response);
            }
        );
    }


    $scope.addToDB = ()=>{ // add generated account details to db
        var url = "addtoDB.php";

        var data = $.param({
            nxtAccountNumber: $scope.accNum,
            numberOfBatches: 0,
            secretPhrase:$scope.password
        }); // prepare data

        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }; // set content header

        $http.post(url,data,config) // makes post request to db
            .then(
                function(response){ // if successful
                    console.log(response);
                    //improve
                    $scope.showqrgen = true; // show qr generation button after added to db
                },
                function(response){ //if error
                    alert('An error has occured, please check console for more information');
                    console.log(response);
                }
            );
    }


    $scope.getQRData = (accNum,batchID,productName,itemQuantity)=>{ // obtains to be generated qr data from inputs (textboxes)
        var obj = {};


        if(productName== null || batchID== null)
        {
            alert('Please fill in the required fields');
        }
        else{
            obj.nxtAccNum = accNum;
            obj.batchID = batchID;
            obj.productName = productName;
            obj.Quantity = itemQuantity;

            console.log(obj);
        //    qrcode.clear();

            $scope.showqrdiv = true;

            qrcode.makeCode(JSON.stringify(obj)); // turn into json
            $scope.showqrgen = false;  //hide qr button after generating


            var url = "updateBatchCount.php";

            var data = $.param({
                recordID : $scope.recordID,
                numberOfBatches : ($scope.currentbatch + 1)
            }); // prepare data to update

            $scope.currentbatch = $scope.currentbatch + 1; // updates data in current context

            if($scope.currentbatch >100){  // this is to check if current account has >100 (after +1 above) as checking only occurs when loading a page, and page does not reload upon creating qr
                                            // if user created few qr in a row without refreshing the page, this will catch the condition where the current batch is at 100 and refreshes the page to make new account.
                alert('Account has over 100 batches, the page will now refresh for a new account.');
                location.reload();
            }
            else{ // if account has not reached 100
                var config = {
                    headers : {
                        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                    }
                };

                $http.post(url, data, config) // updates current account row , where batch + 1; tempoparily changed to post instead of put because web hosting service has issues with .put
        			.then(
        				function (response) {
                            console.log("update success");
                            console.log(response);

        				},
        				function (response) {
                            alert('Something went wrong when trying to update number of batches, please check console and contact your system administrator');
                            console.log(response);
        				}
        			);
            }
        }


    }


    $scope.showqrbtn = ()=>{
        if($scope.accNumber!='')
        {
            $scope.showqrgen = true;

            if($scope.showqrdiv == true){
                $scope.showqrdiv = false;
            }

        }
    }



});

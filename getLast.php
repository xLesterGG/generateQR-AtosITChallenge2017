<?php
    include('dbconfig.php');

    $checkfortrans = $conn->query("SELECT nxtAccountNumber,numberOfBatches,secretPhrase FROM nxtAccounts");
    // echo $checkfortrans;

    // $a = $conn->query("SELECT COUNT(*) FROM nxtAccounts;");
    // echo mysqli_num_rows($checkfortrans);

    if(mysqli_num_rows($checkfortrans) == 0)
    {
        echo 'No data yet';
    }
    else{
        $result = $conn->query("SELECT * FROM nxtAccounts ORDER BY recordID DESC LIMIT 1");
        $rows = array();
        while($r = $result->fetch_assoc()) {
            $rows['accs'][]= $r;
        }

        print json_encode($rows);
    }

?>

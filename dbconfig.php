<?php
    // $db_host="localhost"; // Host name
    // $db_username="id1491090_user"; // Mysql username
    // $db_password="password"; // Mysql password
    // $db_name="id1491090_atos"; // Database name


    $db_host="sql12.freemysqlhosting.net"; // Host name
    $db_username="sql12171519"; // Mysql username
    $db_password="5fkV9EeZNC"; // Mysql password
    $db_name="sql12171519"; // Database name

    // mysql_connect("$db_host", "$db_username", "$db_password","$db_username")or die("dbconfig: cannot connect");
    // mysql_select_db("$db_name")or die("dbconfig: cannot select DB");

    $conn = new mysqli($db_host, $db_username, $db_password, $db_name);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

?>

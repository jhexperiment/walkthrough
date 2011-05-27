<?php

    header("Content-type: application/vnd.ms-excel; name='excel'");
    header("Content-Disposition: filename=export.csv");
    header("Pragma: no-cache");
    header("Expires: 0");

    print $_REQUEST['exportdata'];

?>
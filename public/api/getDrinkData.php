<?php
include('./common.php');

$page = $_GET['page'] ?: 0;
$limit = $_GET['limit'] ?: 0;

getDrinksData($page, $limit);
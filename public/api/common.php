<?php
require_once('./db_inc.php');

/**
 * Get list of drinks
 * 
 * @return json
 */
function getDrinks(){
    //$sql = 'SELECT * FROM `drinks`';
    $base_url = 'https://ccrazy.exofire.net/job/images/';
    $sql = "SELECT `id`, `name`, `cal`, `description`, concat('$base_url', `drinks`.`image`) as image FROM `drinks`";
    
    $t = fetch($sql);
    toJson($t);
}


/**
 * Get list of recordered drink data
 *
 * @param $page  Integer   Page Number
 * @param $limit Integer   Amount of results to return
 * 
 * @return json
 */
function getDrinksData($page, $limit){
    $sql = 'SELECT * FROM `drinkData` ORDER BY id DESC';
    
    $t = fetch($sql);
    toJson($t);
}

/**
 * Make a new drink record
 * 
 * @param $data Array
 * 
 * @return
 */
function addDrinkData($data){
    extract(clean($data));
    $cal = (int)$cal;
    
    $query = "INSERT INTO `drinkData` (`id`, `drink`, `cal`, `date`) VALUES (NULL, '$drink', '$cal', '$date')";
    
    $t = fetch($query, true);
    
    if($t->affected_rows > 0){
        toJson(['status' => 'SUCCESS']);
    }
    else
    {
        toJson([
                'status' => 'FAILED',
                'description' => 'Record not found'
          ]);
    }
}

/**
 * Delete a specific drink record
 * 
 * @param $id  Integer   Record id
 * 
 * @return
 */
function deleteDrinkData($id){
    $id = clean((int)$id);
    $query = "DELETE FROM `drinkData` WHERE `drinkData`.`id` = $id";
    
    $t = fetch($query, true);
    
    if($t->affected_rows > 0){
        toJson(['status' => 'SUCCESS']);
    }
    else
    {
        toJson([
                'status' => 'FAILED',
                'description' => 'Record not found'
           ]);
    }
}


/****************************************************

                Miscallonus Stuff

*****************************************************/

/**
 * Clean input the sql injection
 * 
 * @param $string Array || String
 * 
 * @return Array || String
 */
function clean($string){
    global $mysqli;
    $return_str = false;
    
    if(!is_array($string)){
        $string = [0 => $string];
        $return_str =true;
    }
    
    foreach($string as $s => $v){
        $temp = $v;
        if(get_magic_quotes_gpc())  // prevents duplicate backslashes
        {
            $temp = stripslashes($temp);
        }
        
        $temp = $mysqli->real_escape_string($temp);
        
        $string[$s] = $temp;
    }
    
    if($return_str) return $string[0];
    
    return $string;
}

/**
 * Run the query
 * 
 * @param $query  String   mysql query
 * @param $skip     boolean     returns a mysqli_result object with result set
 * 
 * @return mysqli records || boolean
 */
function fetch($query, $skip = false){
    global $mysqli;
    
    /* Execute the SQL query */
    $result = $mysqli->query($query);
    if (!$result)
    {
       /* if mysqli::query() returns FALSE it means an error occurred */
       $t = [
                'status' => 'FAILED',
                'description' => $mysqli->error
           ];
       //echo 'Query error: ' . $mysqli->error;
       toJson($t);
       die();
    }
    
    if($skip){//Return sql rows?
       return $mysqli;
    }
    
    while($row = $result->fetch_assoc()){ // use fetch_assoc here
        $returnResult[] = $row; // assign each value to array
    }
        
    return $returnResult;
}

//Handle outputing back to the browser json response
function toJson($array){
    header('Access-Control-Allow-Origin: *');
    header('Content-Type: application/json; charset=utf-8');
    
    echo json_encode($array);
}
<?php
    // declare(strict_types= 1);
    //Factorial w/h cycle/recursive

    function fact_rec(int $n) {
        if ($n == 0) return 1;
        return $n * fact_rec($n - 1);
    }

    function fact_c($n) {
        $r = 1;
        for ($i = 2; $i <= $n; $i++) $r *= $i;
        return $r;
    }
?>

<h3>Task 1. </h3>
<?= fact_rec(5)."<br>"?>
<?= fact_c(5)."<br>"?>

<h3>Task 2.</h3>

<?php
    for ($i=1; $i < 6; $i++) { 
        echo "<h{$i}> Hello World!</h{$i}>";
    }
?>

<h3>Task 3.</h3>

<?php
    $t = [0,1,2,3,4,5,6,7];
    // print_r($t);
    // var_dump($t);
    // array_map(callable, array) <> array_filter(array,callable)

    print_r(array_map(function($x){return $x*$x;}, array_filter($t, function($x){return $x % 2 == 0;}))); 
    // array_map(function($x){});
    
    print_r(array_map(fn($x) => $x*$x, array_filter($t, fn($x) => $x % 2 == 0))); 
?>

<h3>Task 4.</h3>

<?php
    function array_every_1(array $arr, callable $fn):bool {
        foreach ($arr as $e) {
            if (!$fn($e)) return false;
        }
        return true;
    }
    $test1 = [2,4,8,0,-4];
    $test2 = [4,3,0,2,-4];

    function array_every_2(array $arr, callable $fn):bool {
        reset($arr);

        while($e = current($arr)) {
            if (!$fn($e)) return false;
            next($arr);
        }
        return true;
    }

    function test_even(int $n):bool {
        return !($n % 2);
    }

    var_dump(array_every_1($test1, "test_even"));
    var_dump(array_every_1($test2, "test_even"));
    var_dump(array_every_2($test1, "test_even"));
    var_dump(array_every_2($test2, "test_even"));
?>

<h3>Task 5.</h3>
<?php $errors = ["Syntax Error", "Stack Overflow", "Out of Memory"]; ?>
<ul>
    <?php foreach ($errors as $e): ?>
        <li> <?= $e?></li>
    <?php endforeach ?>
</ul>

<h3>Task 6.</h3>

<?php
    $bank = [
    [
        "question" => "What da faaaak is diz?",
        "answer" => "What da faaaak is diz?",
    ],
    [
        "question" => "You happy, Vincent?",
        "answers" => [
            1 => "Tadssa",
            2 => "asdas2",
            3q => "asdad3",
        ],
        "correct_answer" => 2
    ]];
?>
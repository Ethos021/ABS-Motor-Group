<?php

$host = getenv('PMA_HOST') ?: 'db';
$port = getenv('PMA_PORT') ?: '3306';
$user = getenv('PMA_USER') ?: getenv('MYSQL_USER') ?: 'root';
$password = getenv('PMA_PASSWORD') ?: getenv('MYSQL_PASSWORD') ?: getenv('MYSQL_ROOT_PASSWORD') ?: '';

$cfg['Servers'][1]['host'] = $host;
$cfg['Servers'][1]['port'] = $port;
$cfg['Servers'][1]['auth_type'] = 'config';
$cfg['Servers'][1]['user'] = $user;
$cfg['Servers'][1]['password'] = $password;
$cfg['Servers'][1]['AllowNoPassword'] = $password === '';

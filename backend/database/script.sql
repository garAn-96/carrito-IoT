-- ============================================
-- CREAR BASE
-- ============================================

CREATE DATABASE IF NOT EXISTS iot_carrito;

USE iot_carrito;

-- ============================================
-- TABLA MOVIMIENTOS
-- ============================================

CREATE TABLE IF NOT EXISTS cat_movimientos(

    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,

    nombre_movimiento VARCHAR(100) NOT NULL
);

-- ============================================
-- TABLA MOVIMIENTOS REGISTRADOS
-- ============================================

CREATE TABLE IF NOT EXISTS movimientos_registrados(

    id_registro INT AUTO_INCREMENT PRIMARY KEY,

    id_movimiento INT,

    origen VARCHAR(50),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(id_movimiento)
    REFERENCES cat_movimientos(id_movimiento)
);

-- ============================================
-- TABLA OBSTACULOS
-- ============================================

CREATE TABLE IF NOT EXISTS obstaculos(

    id_obstaculo INT AUTO_INCREMENT PRIMARY KEY,

    distancia_cm INT,

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA TELEMETRIA
-- ============================================

CREATE TABLE IF NOT EXISTS telemetria(

    id_telemetria INT AUTO_INCREMENT PRIMARY KEY,

    ip VARCHAR(100),

    estado VARCHAR(50),

    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- TABLA PARAMETROS
-- ============================================

CREATE TABLE IF NOT EXISTS parametros(

    id_parametro INT AUTO_INCREMENT PRIMARY KEY,

    clave VARCHAR(100),

    valor VARCHAR(100)
);

-- ============================================
-- TABLA DEMOS
-- ============================================

CREATE TABLE IF NOT EXISTS demos(

    id_demo INT AUTO_INCREMENT PRIMARY KEY,

    nombre_demo VARCHAR(100)
);

-- ============================================
-- TABLA DEMO MOVIMIENTOS
-- ============================================

CREATE TABLE IF NOT EXISTS demo_movimientos(

    id_demo_movimiento INT AUTO_INCREMENT PRIMARY KEY,

    id_demo INT,

    id_movimiento INT,

    orden_movimiento INT,

    FOREIGN KEY(id_demo)
    REFERENCES demos(id_demo),

    FOREIGN KEY(id_movimiento)
    REFERENCES cat_movimientos(id_movimiento)
);


ALTER TABLE demo_movimientos
ADD COLUMN delay_ms INT DEFAULT 700;

-- ============================================
-- INSERT MOVIMIENTOS
-- ============================================

INSERT INTO cat_movimientos(
    nombre_movimiento
)
VALUES

('adelante'),
('atras'),
('izquierda'),
('derecha'),
('stop'),

('vuelta_adelante_derecha'),
('vuelta_adelante_izquierda'),

('vuelta_atras_derecha'),
('vuelta_atras_izquierda'),

('giro_90_derecha'),
('giro_90_izquierda'),

('giro_360_derecha'),
('giro_360_izquierda');

-- ============================================
-- PARAMETROS INICIALES
-- ============================================

INSERT INTO parametros(
    clave,
    valor
)
VALUES

('velocidad','700');

SELECT * FROM demos;

SET SQL_SAFE_UPDATES = 0;

DELETE FROM demo_movimientos;
DELETE FROM demos;
ALTER TABLE demos AUTO_INCREMENT = 1;
ALTER TABLE demo_movimientos AUTO_INCREMENT = 1;


-- ============================================
-- DEMOS
-- ============================================
INSERT INTO demos
(nombre_demo)
VALUES
('Demo Espiral'),
('Demo Patrulla'),
('Demo Escape');

-- ======================================
-- DEMO 1
-- CUADRADO
-- ======================================

INSERT INTO demo_movimientos
(

    id_demo,

    id_movimiento,

    orden_movimiento,

    delay_ms

)
VALUES

(1,1,1,700),
(1,10,2,450),
(1,1,3,700),
(1,10,4,450),
(1,1,5,700),
(1,10,6,450),
(1,1,7,700),
(1,10,8,450);

-- ======================================
-- DEMO 2
-- ZIGZAG
-- ======================================

INSERT INTO demo_movimientos
(

    id_demo,

    id_movimiento,

    orden_movimiento,

    delay_ms

)
VALUES

(2,1,1,600),
(2,6,2,350),
(2,1,3,600),
(2,7,4,350),
(2,1,5,600),
(2,6,6,350);

-- ======================================
-- DEMO 3
-- ESPIRAL
-- ======================================

INSERT INTO demo_movimientos
(

    id_demo,

    id_movimiento,

    orden_movimiento,

    delay_ms

)
VALUES

(3,1,1,400),
(3,10,2,300),
(3,1,3,600),
(3,10,4,300),
(3,1,5,800);

-- ======================================
-- DEMO 4
-- PATRULLA
-- ======================================

INSERT INTO demo_movimientos
(

    id_demo,

    id_movimiento,

    orden_movimiento,

    delay_ms

)
VALUES

(4,1,1,700),
(4,2,2,700),
(4,1,3,700),
(4,2,4,700);

-- ======================================
-- DEMO 5
-- ESCAPE
-- ======================================

INSERT INTO demo_movimientos
(

    id_demo,

    id_movimiento,

    orden_movimiento,

    delay_ms

)
VALUES

(5,2,1,500),
(5,11,2,400),
(5,1,3,700),
(5,10,4,400);


SELECT
id_demo,
nombre_demo
FROM demos;


-- ============================================
-- SP REGISTRAR MOVIMIENTO
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_registrar_movimiento(

    IN p_movimiento VARCHAR(100),
    IN p_origen VARCHAR(50)

)
BEGIN

    DECLARE v_id_movimiento INT;

    SELECT id_movimiento
    INTO v_id_movimiento
    FROM cat_movimientos
    WHERE nombre_movimiento =
    p_movimiento
    LIMIT 1;

    INSERT INTO movimientos_registrados(

        id_movimiento,
        origen

    )
    VALUES(

        v_id_movimiento,
        p_origen
    );

END $$

DELIMITER ;

-- ============================================
-- SP REGISTRAR OBSTACULO
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_registrar_obstaculo(

    IN p_distancia INT

)
BEGIN

    INSERT INTO obstaculos(

        distancia_cm

    )
    VALUES(

        p_distancia
    );

END $$

DELIMITER ;

-- ============================================
-- SP REGISTRAR TELEMETRIA
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_registrar_telemetria(

    IN p_ip VARCHAR(100),
    IN p_estado VARCHAR(50)

)
BEGIN

    INSERT INTO telemetria(

        ip,
        estado

    )
    VALUES(

        p_ip,
        p_estado
    );

END $$

DELIMITER ;

-- ============================================
-- SP ACTUALIZAR PARAMETRO
-- ============================================

DELIMITER $$

CREATE PROCEDURE sp_actualizar_parametro(

    IN p_clave VARCHAR(100),
    IN p_valor VARCHAR(100)

)
BEGIN

    UPDATE parametros
    SET valor = p_valor
    WHERE clave = p_clave;

END $$

DELIMITER ;

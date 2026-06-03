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

-- ============================================
-- DEMOS
-- ============================================

INSERT INTO demos(
    nombre_demo
)
VALUES

('Demo Cuadrado'),
('Demo Zig Zag');

-- ============================================
-- DEMO CUADRADO
-- ============================================

INSERT INTO demo_movimientos(
    id_demo,
    id_movimiento,
    orden_movimiento
)
VALUES

(1,1,1),
(1,10,2),

(1,1,3),
(1,10,4),

(1,1,5),
(1,10,6),

(1,1,7),
(1,10,8);

-- ============================================
-- DEMO ZIG ZAG
-- ============================================

INSERT INTO demo_movimientos(
    id_demo,
    id_movimiento,
    orden_movimiento
)
VALUES

(2,6,1),
(2,7,2),
(2,6,3),
(2,7,4);

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

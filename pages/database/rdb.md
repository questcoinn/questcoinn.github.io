## 관계형 데이터베이스의 구조

### 개요(E. F. Codd, IBM, 1970)
- 개체와 관계를 Relation이라는 테이블로 표현
- 다른 데이터베이스로 변환이 용이
- 성능이 다소 떨어짐

### Relation의 구조
- 튜플(Tuple)
    - Relation의 행
    - 속성의 모임
    - 파일구조: 레코드
    - Cardinality
- 속성(Attribute)
    - Relation의 열
    - 데이처베이스를 구성하는 가장 작은 단위
    - 파일구조: 데이터 항목 / 필드
    - Degree
- 도메인(Domain): 하나의 속성이 취할 수 있는 동일 타입 원자 값들의 집합

### Relation의 특징
- 튜플들은 모두 다름
- 튜플 순서는 없음
- 속성 순서는 중요하지 않음
- 속성 명칭은 유일, 값은 중복될 수 있음
- 튜플을 유일하게 식별하기 위한 속성들의 부분집합인 키(Key) 존재
- 속성 값은 원자값

## 관계형 데이터베이스의 제약조건

### 키(Key)
- 튜플들을 서로 구분할 수 있는 기준 속성(또는 속성들)
- 후보키(Candidate Key): 튜플을 구분하는데 사용할 수 있는 속성들
    - 유일성: 하나의 키값으로 하나의 튜플만을 유일하게 식별 가능
    - 최소성: 모든 레코드들을 구분하는데 꼭 필요한 속성으로만 구성
- 기본키(Primary Key)
    - 후보키 중에서 선택된 주키
    - Null값을 가질 수 없음
- 대체키(Altenate Key): 후보키 중 기본키가 아닌 것들
- 수퍼키(Super Key): 유일성은 만족하지만 최소성은 만족하지 않는 키들
- 외래키(Foreign Key)
    - 두 Relation R1, R2에서 R2가 R1을 참조하여 생성되었을 때, R2의 키 중 "R1의 키본키"가 외래키가 됨
    - 참조 Realtion의 기본키 도메인에 없는 값은 외래키의 값으로 입력 불가능

### 무결성
- 개체 무결성: 기본키를 구성하는 속성은 Null값이나 중복값을 가질 수 없음
- 참조 무결성
    - 외래키값은 Null이거나 참조 Relation의 기본키값과 동일해야 함
    - 외래키와 참조하려는 테이블의 기본키는 도메인과 속성 갯수가 같아야 함

## 관계대수 및 관계해석

### 관계대수

#### 개요
- 데이터베이스에서 원하는 정보나 그 정보를 검색하기 위해 어떻게 유도하는가를 기술
- 절차적 언어
- 피연산자: Relation, 결과: Relation
- ex)
    - 순수관계연산자: Select, Project, Join, Division
    - 일반집합연산자: UNION, INTERSECTION, DIFFERENCE, CARTESIAN PRODUCT

#### 순수관계연산자
1. Select: σ_조건 (Relation)
    - Relation의 튜플 중 조건을 만족하는 튜플들을 모아 새로운 Relation을 구성
    - 수평 연산자
2. Project: π_속성리스트 (Relation)
    - Relation에서 제시된 속성만을 추출 
    - 수직 연산자
3. Join: Relation1 ⋈_키속성1=키속성2 Relation2
    - 공통 속성을 중심으로 두 Relation을 하나로 합쳐 새로운 Relation을 만듦
4. Division: Relation1 [키속성1 ÷ 키속성2] Relation2
    - Relation1이 Relation2를 포함하는 조건에서 사용
    - Relation1에서 (Relation2의 해당 속성의 값)을 모두 가지는 튜플을 뽑아서 그 속성을 제외한 뒤 Relation을 구성

#### 일반집합연산자
- 합집합, 교집합, 차집합은 합병조건을 만족해야 함
    - 합병조건: 두 Relation 간 속성 수가 같고, 도메인 범위도 같아야 함

### 관계해석(E. F. Codd)
- 관계데이터의 연산을 표현하는 방법
- 비절차적 언어
- 관계대수로 표현한 식은 관계해석으로 표현이 가능
- 질의어로 표현

## 정규화(Normalization)</h3>

### 개요
- 함수 종속성을 이용하여 관계형 스키마를 더 적은 속성의 바람직한 스키마로 만드는 과정
- 논리적 설계단계에서 수행

### 목적
- 안정성 최대화
- 어떤 Relation이라도 데이터베이스 내에서 표현 가능하도록 만듦
- 중복을 배제하여 이상 발생을 방지
- Relation 재구성의 필요성을 줄임

이상(Anomaly): 삽입이상, 삭제이상, 갱신이상

원칙: 무손실, 분리, 중복성 감소

1. 1NF: 모든 도메인이 원자값
2. 2NF: 1NF + 키가 아닌 모든 속성이 기본키에 대해 완전함수적종속
    - 속성2는 속성1에 "함수적종속" <=> 속성1에 따라 속성2의 값이 결정 
    - 속성 a가 집합 B의 속성들에 대해 "완전함수적종속" <=> 속성 a가 다른 속성집합 B 전체에 대해 함수적 종속이지만, 진부분집합에 대해서는 함수적종속이 아님
3. 3NF: 2NF + 기본키가 아닌 모든 속성이 기본키에 대해 이행적종속이 아님
    - 이행적종속: A -> B && B -> C => A -> Codd
    - 무손실조인 또는 종속성보존을 저해하지 않고도 항상 3NF를 얻을 수 있음
4. BCNF(Boyce-Codd): 3NF + 결정자가 모두 후보키

## SQL의 개념

### 개요
- SEQUEL에서 유래(IBM)
- 관계대수와 관계해석을 기초
- 질의어 + 정의, 조작, 제어기능

### 분류
1. DDL(_6)
    - 스키마, 도메인, 테이블, 뷰, 인덱스를 정의, 변경, 삭제
    - 논리적, 물리적 데이터 구조와 사상을 정의
    - 관리자나 설계자가 사용
    - ex)
        - CREATE: 스키마, 도메인, 테이블, 뷰, 인덱스 정의
        - ALTER: 테이블 정의 변경
        - DROP: 스키마, 도메인, 테이블, 뷰, 인덱스 삭제
2. DML(_7)
    - ex) SELECT, INSERT, DELETE, UPDATE

3. DCL
    - 데이터보안, 무결성, 회복, 병행수행제어 등 정의
    - ex)
        - COMMIT: 물리디스크에 저장하고 조작작업이 완료됨을 관리자에게 알림
        - ROLLBACK: 조작작업이 비정상적으로 종료되었을 때 복구
        - GRANT: 사용권한 부여
        - REVOKE: 사용권한 취소

## DDL

### CREATE

```sql
CREATE SCHEMA 스키마이름 AUTHENTICATION 사용자id;
```

```sql
CREATE DOMAIN 도메인이름 데이터타입 [DEFAULT 묵시값] [CONSTRAINT VALID-도메인이름 CHECK(범위값)];
```

```sql
CREATE TABLE 테이블이름(
    속성명1 데이터타입 [NOT NULL], ...,
    PRIMARY KEY(기본키속성명),
    UNIQUE(대체키속성명1, ...),
    FOREIGN KEY(외래키속성명2, ...) REFERENCES 참조테이블(기본키속성명),
    CONSTRAINT 제약조건명 CHECK(조건식));
```

```sql
CREATE [UNIQUE] INDEX 인덱스이름 ON 기본테이블이름({속성이름 [ASC|DESC], ...}) [CLUSTER];
```
CLUSTER: 동일 인덱스값의 튜플들을 그룹으로 묶음


```sql
CREATE VIEW 뷰이름 [속성이름1, ...] AS select문
```

### ALTER

```sql
ALTER TABLE 기본테이블이름 ADD 속성이름 데이터타입 [DEFAULT '기본값'];
```

```sql
ALTER TABLE 기본테이블이름 ALTER 속성이름 데이터타입 [SET DEFAULT '기본값'];
```

```sql
ALTER TABLE 기본테이블이름 DROP 속성이름 [CASCADE];
```

### DROP

```sql
DROP SCHEMA 스키마이름 [CASCADE|RESTRICTED];
```

```sql
DROP DOMAIN 도메인이름 [CASCADE|RESTRICTED];
```

```sql
DROP TABLE 테이블이름 [CASCADE|RESTRICTED];
```

```sql
DROP VIEW 뷰이름 [CASCADE|RESTRICTED];
```

```sql
DROP INDEX 인덱스이름;
```

## DML

### SELECT

```sql
SELECT [ALL|DISTINCT|DISTINCTROW] [테이블명1.]속성명1, ... FROM 테이블명1, ...
    [WHERE 조건] [GROUP BY 속성명1, ...] [HAVING 조건] [ORDER BY 속성명 [ASC|DESC]];
```

### INSERT

```sql
INSERT INTO 테이블명(속성명1, ...) VALUES (데이터1, ...);
```

### DELETE

```sql
DELETE FROM 테이블명 WHERE 조건;
```

### UPDATE

```sql
UPDATE 테이블명 SET 속성명1=데이터1[, 속성명2=데이터2, ...] WHERE 조건;
```

## 내장 SQL

### 정의
응용프로그램 내에 데이터베이스에서 사용하는 변수를 정의 또는 SQL문장을 내포하여 프로그램이 실행될 때 함께 실행되도록 호스트프로그램언어로 만든 프로그램에 삽입된 SQL

### 특징
- 프로그램 어디서나 사용 가능
- 단 하나의 튜플만을 반환
- 선행처리기에의해 분리되어 컴파일됨
- SQL 상태변수
    - 0: 성공
    - 100: Not Found
    - 양수: 경고
    - 음수: 에러

### 호스트언어 실행문과의 구분방법
- 명령문
    - C/C++: ; 사이에 기술
    - Visual BASIC: 앞에 EXEC SQL 삽입
- 변수: 앞에 : 삽입

### 커서(Cursor)
- 내장 SQL문 수행 결과 반환되는 첫 번째 튜플에 대한 포인터
- 반환되는 복수의 튜플들을 액세스 할 수 있게 해줌
- DECLARE: 커서에 관련된 선언
    - OPEN: 커서가 첫 번째 튜플을 포인트하도록 함
    - FETCH: 다음 튜플로 커서 이동
    - CLOSE: 카사 닫기

## 뷰(View)

### 개요
- 사용자에게 접근이 허용된 자료만을 제한적으로 보여주기위해 기본테이블에서 유도된 가상테이블
- 물리적으로 존재하지 않음

### 특징
- 물리적으로 구현되지 않음
- 데이터의 논리적 독립성을 제공
- 관리 용이, 명령문이 간단해짐
- 뷰에 없는 데이터를 보호
- 기본키를 포함해야 삽입, 삭제, 갱신이 가능
- 뷰를 삭제하면 그 뷰를 기초로 구축된 다른 뷰도 삭제됨

## 시스템 카탈로그(System Catalog)
ex) SYSTABLES, SYSCOLUMNS, SYSINDEXES, ...

### 개요
- 시스템 그 자체에 관련있는 다양한 객체에 대한 정보를 포함하는 시스템 "데이터베이스 / 테이블"
- 자료사전에 저장됨 => 좁은의미로 자료사전
- 카탈로그에 저장된 정보는 메타데이터

### 특징
- 일반 사용자도 SELECT문으로 내용 검색 가능
- INSERT, DELETE, UPDATE 불가능
- 시스템에따라 상이한 구조
- DBMS가 자동으로 생성, 유지

### 카탈로그를 참조하기위한 DBMS 내의 모듈 시스템
- DDL / DML 번역기
- 데이터 디렉토리(Data Directory)
    - 데이터 사전에 접근하는데 필요한 정보를 유지, 관리
    - 시스템만 접근 가능
- 질의 최적화기
- 트랜잭션 처리기
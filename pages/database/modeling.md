## 데이터 모델의 개념

### 정의
- 현실의 정보 >> 컴퓨터에 표현
- 데이터의 구조를 논리적으로 묘사

### 종류
1. 개념적 데이터 모델 / 정보 모델
    - 인간의 이해를 돕기 위해 사용
    ex) E-R 모델(_2)
2. 논리적 데이터 모델
    - 개념적 구조를 컴퓨터가 이해할 수 있는 형태로 변환
    - 필드와 관계를 이용해 표현
    - 관계 모델(_3), 계층 모델(_4), 네트워크 모델(_5)

### 표시할 요소
1. 구조: 개체 타입들 간의 관계 / 데이터 구조 및 정적 성질
2. 연산: 데이터베이스를 조작하는 기본 도구
3. 제약조건

### 구성 요소
1. 개체(Entity)
    - 데이터베이스에 표현하려는 것
    - 파일 시스템의 레코드(Record)
2. 속성(Attribute)
    - 데이터의 가장 작은 논리적 단위
    - 파일 구조상의 데이터 항목 / 필드(Field)
    - 개체를 구성
3. 관계(Relationship)
    - 개체 간, 속성 간의 관계
    - 1:1, 1:n(일 대 다), m:n

## 개체-관계(E-R) 모델

### 개요(Peter Chen, 1976)
- 개념적 데이터 모델
- DBMS에 독립적
- E-R 다이어그램으로 표현

### E-R 다이어그램
- 사각형: 개체
- 마름모: 관계
- 타원: 속성
- 밑줄 타원: 기본 키
- 선 / 링크: 개체와 속성, 개체와 관계를 연결
    - 선위에 개체 간 관계에 대한 대응수를 기술(1:1, 1:n, m:n)
- 확장된 E-R 다이어그램: 
    - 속성은 하얀색, 기본 키는 검은색 작은 원
    - 선위에 (최소 대응수, 최대 대응수) 기술

## 관계형 데이터 모델

### 개념
- 2차원 테이블을 이용하여 데이터 상호 관계를 정의
- 기본키와 외래키로 관계를 표현
- 대표적 언어가 질의어(SQL)
- 1:1, 1:n, m:n 관계를 자유롭게 표현 가능
- 다른 데이터베이스로 변환이 용이함
- 성능은 떨어짐
- 개체: 튜플(Tuple)

## 계층형 데이터모델
ex) IMS

### 구성 형태
- 트리 구조
- 각 개체가 트리의 노드
- 개체 간 관계를 부모와 자식 간 관계로 표현
- 개체: 세그먼트(Segment)

### 특징
- 1:n 관계만 존재
- 삭제 >> 연쇄삭제
- 사이클이 허용되지 않음
- 두 개체 간 하나의 관계만 허용됨

## 네트워크 데이터 모델
ex) DBTG, EDBS, TOTAL

### 개요(CODASYL)
- 그래프를 사용
- 상위, 하위 레코드 사이에 m:n 관계를 만족
- 개체: 레코드(Record)

### 표현
- Entity 군: 동종의 개체 그룹
- Entity SET: 주종관계 Entity 군들의 그룹
- SET Membership Type: m:n 관계에 연관된 레코드 (부모: Owner, 자식: Member)

### 특징
- 레코드 타입과 링크들의 집합으로 구성
- 레코드 타입의 집합이 존재
- 레코드 타입들을 연결하는 링크 집합이 존재
- 관계성에 제한이 없음
- 모든 링크는 적어도 한 방향으로는 함수적(부분적 함수성)
- 세트 이름은 링크로 표현
- 오너와 멤버 레코드 타입은 동일 형태가 불가능

## 데이터베이스의 설계

### 고려사항
- 무결성: 연산 후에도 저장된 데이터가 정해진 제약조건을 만족
- 일관성: 특정 데이터를 사용한 특정 질의에 대한 응답은 항상 일정
- 회복
- 보안
- 효율성
- 데이터베이스 확장

### 과정
1. 요구 조건 분석
2. 개념적 설계
    - 개념 스키마 모델링 + 트랜잭션 모델링 (병행수행)
    - E-R 다이어그램 작성
    - DBMS에 독립적인 개념 스키마 작성
3. 논리적 설계
    - DBMS에 따라 적절한 논리적 스키마를 설계
    - 트랜잭션의 인터페이스의 설계
    - 관계형 데이터베이스라면 테이블을 설계
4. 물리적 설계
    - 데이터가 컴퓨터에 저장되는 방식을 묘사
    - 꼭 포함되어야 할 것: 레코드 양식 설계, 레코드 집중의 분석과 설계, 접근경로 설계
    - 물리적 데이터베이스 구조는 여러 타입의 저장 레코드 집합 >> 단순 파일과는 다름
    - 시스템 성능에 중대한 영향
    * 고려사항: 반응시간, 공간활용도, 트랜잭션 처리량
5. 데이터베이스 구현
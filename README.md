<img src = "https://velog.velcdn.com/images/fearofcod/post/d1be2686-ff27-49de-a2dc-e37030b0d26f/image.gif"><br/>
<img src = "https://velog.velcdn.com/images/fearofcod/post/c714e43e-642b-4014-9676-5ceae84966c4/image.gif"><br/>
<img src = "https://velog.velcdn.com/images/fearofcod/post/9e69dc53-cf2c-4e0d-931b-e41d6ecd1c0e/image.gif"><br/>
yarn add react-big-calendar <br/>
npm install --save react-big-calendar<br/>


DB DDL<br>  
TABLE

	    CREATE TABLE "SCOTT"."SCHEDULEINFO" 
		     (	
		    "CALELDAR_ID" NUMBER(*,0), 
		  	"USER_ID" VARCHAR2(255), 
		  	"TITLE" VARCHAR2(255), 
		  	"ALLDAY" VARCHAR2(19),
		  	"START_DATE" DATE, 
		  	"END_DATE" DATE, 
		  	"MEMO" CLOB
		     )
  SEQUENCE
   
    CREATE SEQUENCE SEQ_CALENDAR_ID INCREMENT BY 1;<br/><br/>

DB DML<br/>

  SELECT

		SELECT
			CALELDAR_ID,
			TITLE,
			ALLDAY,
			TO_CHAR(START_DATE, 'YYYY-MM-DD HH24:MI') AS START_DATE,
			TO_CHAR(END_DATE, 'YYYY-MM-DD HH24:MI') AS END_DATE,
			MEMO
		FROM
			${schema}.PT_SCHEDULE_INFO

  INSERT


   		INSERT INTO
				${schema}.PT_SCHEDULE_INFO(CALELDAR_ID ,
				TITLE,
				ALLDAY,
				START_DATE,
				END_DATE,
				MEMO)
		VALUES(${schema}.SEQ_CALENDAR_ID.NEXTVAL,
				#{title},
				#{allday},
				TO_DATE(#{start}, 'YYYY-MM-DD HH24:MI'),
				TO_DATE(#{end}, 'YYYY-MM-DD HH24:MI'),
				#{memo})

  UPDATE

    	UPDATE 
			${schema}.PT_SCHEDULE_INFO 
		SET
			TITLE = #{title},
			ALLDAY = #{allday}, 
			START_DATE = TO_DATE(#{start}, 'YYYY-MM-DD HH24:MI') ,
			END_DATE = TO_DATE(#{end}, 'YYYY-MM-DD HH24:MI'),
			MEMO = #{memo}
		WHERE
			CALELDAR_ID = #{id}

  DELETE

   		DELETE
		FROM
			${schema}.PT_SCHEDULE_INFO
		WHERE
			CALELDAR_ID = #{id}

import {Pool} from 'pg' ;
const pool=new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "chakchabani",
  database: "recept_tjanst"
});

export default pool;
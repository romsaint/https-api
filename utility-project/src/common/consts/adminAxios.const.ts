import axios from "axios";
import * as https from 'https'
import * as path from "path";


const certPath = path.resolve(__dirname, '../../../../../project/src/secrets/cert.pem');
const keyPath = path.resolve(__dirname, '../../../../../project/src/secrets/key.pem');

export const adminAxios = axios.create({
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
        cert: require('fs').readFileSync(certPath),
        key: require('fs').readFileSync(keyPath),
    }),
    // ADMIN AUTH
    headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNubTIwMDYxOTc3QGdtYWlsLmNvbSIsInN1YiI6IjRmYjQ0MDg3LWY2ZmQtNGNhNy1hYzQwLTA0YmY4ODk2MGEyZiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTcyNzcwNTkxOCwiZXhwIjoxNzMwMjk3OTE4fQ.JzLXIYNGYZtEUo7ZGM8g_R0MX1arfPs-ToueC4_vFjI`
    }
})

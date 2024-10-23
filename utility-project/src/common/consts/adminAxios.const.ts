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
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InJvbWEuZ2dnLjIwQGxpc3QucnUiLCJ1c2VybmFtZSI6IkpvbnkgQm9ueSBHZWtzIiwicGFzc3dvcmQiOiJhMGJjN2VjMmYyN2I0NTI1YzA4Mjg4ZWRiZmUxZDJiNWZhNzE3NjZiZWQ4NGE2ZTRlMDc3YjVjZmQzNzc1OGQ5N2E5MTZlZjBhN2ZkMDk2ZmQ1MjBkYjg4OTU2NTU3MjY5ODBiZGE0M2VlNTc1YTAyYWNmMjQ3NDYzZDIxNjhlZiIsInJvbGUiOiJBRE1JTiIsInNhbHQiOiIxNGRkZjdmNTQ1N2MzZmM3ZWNiZjViNWU5ZjA1MjY5ZjU2OTIwM2NhYmIwNjFjZGQwM2EzMzVjZTIxOTc0NmM4IiwiaWF0IjoxNzI5NTk3NzQyLCJleHAiOjE3MzIxODk3NDJ9.RwFMUxPloHNZQ1e3w3XDg5iNXV2cWU4PesriY4lUCzM`
    }
})

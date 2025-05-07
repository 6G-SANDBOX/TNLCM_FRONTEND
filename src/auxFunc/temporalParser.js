export async function accessVPN(data){
    const start = '# Wireguard VPN configuration based on script';
    const pattern = new RegExp(`${start}[\\s\\S]*?(?=^\\\`\\\`\\\`)`, 'm');
    const match = data.match(pattern);
    return match ? match[0].trim() : null;
}
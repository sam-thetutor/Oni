# Troubleshooting Guide

## Common Issues

### Wallet Connection Problems

#### Issue: Wallet won't connect
**Symptoms**: Connection button doesn't respond or shows error

**What it should look like:**
![Correct Wallet Connection](/img/navigation/wallet-connection.png)

*The wallet connection interface should show a clear "Connect Wallet" button and network status.*

**Common Error State:**
![Wallet Connection Error](/img/Screenshot%202025-08-02%20at%2018.48.30.png)

*If you see this screen, ensure your wallet is properly connected to the CrossFi network.*

**Solutions**:
1. Check if your wallet extension is installed and enabled
2. Ensure you're on the correct network (CrossFi testnet/mainnet)
3. Try refreshing the page and reconnecting
4. Clear browser cache and cookies

#### Issue: Wrong network detected
**Symptoms**: "Please switch to CrossFi network" error
**Solutions**:
1. Add CrossFi network to your wallet:
   - **Chain ID**: 4157 (testnet) or 4158 (mainnet)
   - **RPC URL**: https://rpc.testnet.ms or https://rpc.mainnet.ms
   - **Explorer**: https://test.xfiscan.com or https://xfiscan.com
2. Switch to the correct network in your wallet
3. Refresh the page

### Transaction Issues

#### Issue: Transaction fails
**Symptoms**: Transaction shows as failed or pending indefinitely
**Solutions**:
1. Check your XFI balance for gas fees
2. Ensure you have sufficient funds for the transaction
3. Try increasing gas limit if available
4. Check network congestion on CrossFi explorer

#### Issue: Payment link not working
**Symptoms**: Payment link shows error or doesn't process payment

**What it should look like:**
![Payment Links Interface](/img/features/payment-links.png)

*The payment links interface should show active links with clear status indicators.*

**Payment Link Creation Process:**
![Payment Link Creation](/img/Screenshot%202025-08-02%20at%2018.49.10.png)

*Proper payment link creation interface with configuration options.*

![Payment Link Setup](/img/Screenshot%202025-08-02%20at%2018.49.16.png)

*Payment link setup form with amount and description fields.*

**Solutions**:
1. Verify the payment link is still active
2. Check if the link amount is correct
3. Ensure you have sufficient XFI balance
4. Try using a different wallet

### DCA Trading Issues

#### Issue: DCA order not executing
**Symptoms**: Orders remain pending or don't execute on schedule

**What it should look like:**
![DCA Trading Interface](/img/features/dca-trading.png)

*The DCA trading interface should show active orders with clear status and execution schedules.*

**Solutions**:
1. Check if the order is active (not paused)
2. Verify you have sufficient balance for the order
3. Check the execution schedule (daily/weekly/monthly)
4. Review order history for any error messages

#### Issue: Can't create DCA order
**Symptoms**: Order creation fails or shows error
**Solutions**:
1. Ensure you have sufficient XFI balance
2. Check if the token is supported
3. Verify the amount meets minimum requirements
4. Try creating the order again

### Performance Issues

#### Issue: Slow loading times
**Symptoms**: Pages take long to load or are unresponsive
**Solutions**:
1. Check your internet connection
2. Try refreshing the page
3. Clear browser cache and cookies
4. Disable browser extensions that might interfere

#### Issue: Real-time updates not working
**Symptoms**: Balance or transaction data not updating automatically
**Solutions**:
1. Check if WebSocket connection is active
2. Refresh the page to reconnect
3. Check browser console for connection errors
4. Try using a different browser

## Error Messages

### "Insufficient Balance"
- **Cause**: Not enough XFI for transaction or gas fees
- **Solution**: Add more XFI to your wallet

### "Network Error"
- **Cause**: Connection to CrossFi network failed
- **Solution**: Check network status and try again

### "Invalid Signature"
- **Cause**: Wallet signature verification failed
- **Solution**: Reconnect your wallet and try again

### "Order Not Found"
- **Cause**: DCA order was deleted or doesn't exist
- **Solution**: Check order history or create a new order

## Getting Help

### Support Channels
- **Documentation**: Check this troubleshooting guide
- **GitHub Issues**: Report bugs on the project repository
- **Community**: Join the Discord community for help

### Information to Provide
When reporting issues, include:
- **Error Message**: Exact error text
- **Steps to Reproduce**: How to trigger the issue
- **Browser/OS**: Your browser and operating system
- **Wallet Type**: Which wallet you're using
- **Network**: Testnet or mainnet 
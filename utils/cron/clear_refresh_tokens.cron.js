const RefreshTokenRepository = require('../../repository/refresh_token.repository');
const Cron = require('node-cron');

const task = Cron.schedule('0 1 * * *', async () => {
    console.log('Running task : Delete expired refresh tokens');
    const expiredRefreshTokens = await RefreshTokenRepository.deleteExpiredTokens();
    console.log(`${expiredRefreshTokens.deletedCount} token(s) deleted !`);
});

task.start();

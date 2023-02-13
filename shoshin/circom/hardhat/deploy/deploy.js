module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const Verifier = await deploy('Verifier', {
        from: deployer,
        log: true
    });

    await deploy('Register', {
        from: deployer,
        args: [Verifier.address],
        log: true
    });

};
module.exports.tags = ['complete'];

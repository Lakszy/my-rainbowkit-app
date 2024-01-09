import { ConnectButton } from '@rainbow-me/rainbowkit';
// import '../App.css';

function ConnectBtn() {
  return (
    <ConnectButton.Custom>
    {({
      account,
      chain,
      openAccountModal,
      openChainModal,
      openConnectModal,
      authenticationStatus,
      mounted,
    }) => {
      // Note: If your app doesn't use authentication, you
      // can remove all 'authenticationStatus' checks
      const ready = mounted && authenticationStatus !== 'loading';
      const connected =
        ready &&
        account &&
        chain &&
        (!authenticationStatus ||
          authenticationStatus === 'authenticated');

      return (
        <div
          {...(!ready && {
            'aria-hidden': true,
            'style': {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!connected) {
              return (
                <button className='btn btn-riv-primary' onClick={openConnectModal} type="button">
                  Connect Wallet
                </button>
              );
            }

            if (chain.unsupported) {
              return (
                <button className='btn btn-riv-primary' onClick={openChainModal} type="button">
                  Wrong network
                </button>
              );
            }

            return (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                className='btn btn-riv-secondary connect_btn_wdth'
                  onClick={openChainModal}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  type="button"
                >
                  {chain.hasIcon && (
                    <div
                      style={{
                        background: chain.iconBackground,
                        height:24,
                        borderRadius: 999,
                        overflow: 'hidden',
                        marginRight: 4,
                      }}
                    >
                      {/* {chain.iconUrl && (
                        <img
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          style={{ width: 22, height: 20 }}
                        />
                      )} */}
                    </div>
                  )}
                  {chain.name}
                </button>

                <button   className='btn btn-riv-secondary connect_btn_wdth'
                onClick={openAccountModal} type="button">
                  
                  {account.displayName}
                  <span className='notMobileDevice'>
                  {account.displayBalance
                    ? ` (${account.displayBalance})`
                    : ''}
                    </span>
                </button>
              </div>
            );
          })()}
        </div>
      );
    }}
  </ConnectButton.Custom>
  );
}

export default ConnectBtn;

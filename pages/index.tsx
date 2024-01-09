// Import necessary modules and components
import React, { useEffect, useRef, useState } from 'react';
import { Skeleton } from 'primereact/skeleton'; // Import Skeleton component from PrimeReact
import { useAccount } from 'wagmi';
import ConnectBtn from './ConnectBtn';
import keyCircleImg from '../../keyCircle2.svg';
import coins from '../../coinsNew.svg';
// import tvlIMg from '../../tvlv2.svg';
import tvlIMg from '../../tvlv2.svg';
import axios from 'axios';
import dis from '../../svgviewer-output.svg';
import arrow from '../../svgviewer-output (1).svg';
import { Accordion, AccordionTab } from 'primereact/accordion';
// import '../../App.css';

// Define interfaces for data structures
interface HistoryItem {
    date: string;
    name: string;
    allocation: string;
}

interface ApiResponse {
    _id: string;
    walletAddress: string;
    xriv: number;
    history: HistoryItem[];
}

// Helper function to parse date string
function parseDateString(dateString: string): Date | null | any {
    const parts = dateString.split('/');
    if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10) + 2000;

        return new Date(year, month, day);
    }
    return null;
}

// Main Reward component
function Reward() {
    // Use Wagmi hook to get account information
    const { address, isConnected } = useAccount();

    // State variables for component
    const [isDataLoading, setIsDataLoading] = useState(false);
    const [portfolio, setPortfolio] = useState<number | string>('');
    const [totalVault, setTotalVault] = useState<number>(0);
    const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
    const fAQ = useRef(null);

    // Effect hook to fetch data when connected
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsDataLoading(true);
                // Fetch data from API
                const response = await axios.get<ApiResponse>(
                    `https://api.rivera.money/xriv/users/0xDB0132c875eA7A00c4a6283da592ae6500205396`
                    // `https://api.rivera.money/xriv/users/${address}`
                );
                const data = response.data;

                // Update component state with API response
                setApiResponse(data);
                setPortfolio(data.xriv);
                setTotalVault(data.history.reduce((total, item) => total + Number(item.allocation), 0));

                setIsDataLoading(false);
            } catch (error) {
                setIsDataLoading(false);
            }
        };

        // Fetch data only when connected
        if (isConnected) {
            fetchData();
        }
    }, [address, isConnected]);

    // JSX template for rendering the component
    return (
        <div className='custom-container'>
            {isConnected ? (
                // Render connected state
                <div className='second_section_xRiv outer_section_first_xRiv'>
                    <div className='dsp_cont_first_section'>
                        <div className='wdth_40_first'>
                            <div className='holding_header_inner mb-2 redHatFont'>xRIV Pre-Mine Program</div>
                            <div className='mb-3'>
                                <div>Total Earnings</div>
                                <div className='holding_header_inner secondary_color redHatFont'>
                                    {isDataLoading ? (
                                        <Skeleton width='5rem' className='mb-2'></Skeleton>
                                    ) : portfolio ? (
                                        `${portfolio} xRIV`
                                    ) : (
                                        'No Reward'
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className='l1 disbtn'
                            onClick={() => window.open('http://discord.gg/sbMxwS6VEV', '_blank')}
                            role='button'
                            tabIndex={0}
                        >
                            <div className='discord_button'>
                                <span className="circle-container">
                                    <img className='' src={dis} alt='Discord' />
                                </span>
                                <span className='disText'>Join Discord</span>
                                <span>
                                    <img className='arrowIcon' src={arrow} alt='Arrow' height={20} />
                                </span>
                            </div>
                        </div>

                        <div>
                            <img height={200} src={coins} alt='rocket img' className='rocketImg' />
                        </div>
                    </div>
                </div>
            ) : (
                // Render disconnected state
                <div className='second_section_xRiv outer_section_first_xRiv'>
                    <div className='dsp_cont_first_section'>
                        <div className='wdth_40_first'>
                            <ConnectBtn />
                        </div>
                        <div className='wdth_30_first'>
                            <div className='tvl_back pddng_20'>
                                <div className='dsp fnt_wgt_600 '>
                                    <span className='op_60'>TVL</span>
                                    <div className='lqdt_icon_wdth'>
                                        <img src={tvlIMg} alt='tvl' />
                                    </div>
                                </div>
                            </div>
                            <div className='dspl_between'>
                                <div className='tvl_back pddng_20 width_48'>
                                    <div className='dsp fnt_wgt_600'>
                                        <span className='op_60'>Vaults</span>
                                        <div className='lqdt_icon_wdth_key'>
                                            <img src={keyCircleImg} alt='tvl' />
                                        </div>
                                    </div>
                                    <div className='holding_header_inner redHatFont'>{totalVault}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <img src={coins} alt='rocket img' className='rocketImg' />
                        </div>
                    </div>
                </div>
            )}

            {isConnected && apiResponse ? (
                // Render connected state with API response
                <div className='p-sec grid grid-clos-2 '>
                    <div className='history'>
                        <h2 className=' mb-4 redHatFont history_txt'>History</h2>
                        {apiResponse.history.length > 0 ? (
                            // Render history table if there is data
                            <table className='table-container redHatFont'>
                                <thead className='redHatFont'>
                                    <tr>
                                        <th className='redHatFont'>Date</th>
                                        <th>Event</th>
                                        <th>Allocation</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {apiResponse.history
                                        .slice()
                                        .sort(
                                            (a, b) =>
                                                parseDateString(b.date)?.getTime() -
                                                parseDateString(a.date)?.getTime() ||
                                                0
                                        )
                                        .map((item, index) => (
                                            // Render table rows with data
                                            <tr key={index}>
                                                <td className=''>{item.date}</td>
                                                <td className=''>{item.name}</td>
                                                <td className='secondary_color fnt_wgt_600'>{item.allocation}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        ) : (
                            // Display if no reward history
                            <div>No Reward History</div>
                        )}
                    </div>
                    <div className='faq'>
                        <section id='fAQ' ref={fAQ}>
                            <div className='sixth_section outer_section_detail mb-5'>
                                <div className='history_txt mb-4 redHatFont'>FAQ</div>
                                <div>
                                    <Accordion activeIndex={0}>
                                        <AccordionTab header="What is xRIV?">
                                            <p className="m-0">
                                                xRIV (Rivera Experience Token) is the pre-mined $RIV token created to bootstrap liquidity and incentivize early adopters of the Rivera ecosystem.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="Do I get RIV tokens or its derivatives?">
                                            <p className="m-0">
                                                You will receive a non-transferrable xRIV token which can be redeemed into RIV tokens at a 1:1 ratio after TGE (subject to vesting).
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="How often are the rewards updated?">
                                            <p className="m-0">
                                                User rewards are updated weekly.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="When will the TGE be?">
                                            <p className="m-0">
                                                The TGE is expected in 2024. More details will be announced via official channels.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="What is RIV Premine?">
                                            <p className="m-0">
                                                Our premine program enables users to earn xRIV tokens which can be redeemed during TGE (Token Generation Event). This is different from retroactive rewards for the early supporters of Rivera.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="I need more clarifications, what should I do?">
                                            <p className="m-0">
                                                Read our <a href="https://rivera.gitbook.io/docs/tokenomics/usdriv" target="_blank" rel="noopener noreferrer">docs</a> or ask the team in our <a href="https://discord.com/invite/sbMxwS6VEV" target="_blank" rel="noopener noreferrer">discord</a>.
                                            </p>
                                        </AccordionTab>
                                    </Accordion>

                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            ) : (
                // Render disconnected state with default content
                <div className='p-sec grid grid-clos-2 '>
                    <div className='history'>
                        <h2 className='history_txt mb-4 redHatFont'>History</h2>
                        {isDataLoading ? (
                            // Render skeleton while data is being loaded
                            <div className='skel'>
                                <Skeleton width='20%' height='20px' />
                                <Skeleton width='20%' height='20px' />
                                <Skeleton width='20%' height='20px' />
                            </div>
                        ) : (
                            <>
                                {/* Render empty table if no data */}
                                <table className='table-container redHatFont'>
                                    <thead className='redHatFont'>
                                        <tr>
                                            <th className='redHatFont'>Date</th>
                                            <th>Amount</th>
                                            <th>Allocation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* You can add your data rendering logic here */}
                                    </tbody>
                                </table>
                                <div className='p-1 hdr_txt'>No xRIV earned. Deposit in Rivera vaults to start earning</div>
                            </>
                        )}
                    </div>

                    <div className='faq'>
                        <section id='fAQ' ref={fAQ}>
                            <div className='sixth_section outer_section_detail mb-5'>
                                <div className='history_txt mb-4 redHatFont'>FAQ</div>
                                <div>
                                    <Accordion activeIndex={0}>
                                        <AccordionTab header="What is xRIV?">
                                            <p className="m-0">
                                                xRIV (Rivera Experience Token) is the pre-mined $RIV token created to bootstrap liquidity and incentivize early adopters of the Rivera ecosystem.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="Do I get RIV tokens or its derivatives?">
                                            <p className="m-0">
                                                You will receive a non-transferrable xRIV token which can be redeemed into RIV tokens at a 1:1 ratio after TGE (subject to vesting).
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="How often are the rewards updated?">
                                            <p className="m-0">
                                                User rewards are updated weekly.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="When will the TGE be?">
                                            <p className="m-0">
                                                The TGE is expected in 2024. More details will be announced via official channels.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="What is RIV Premine?">
                                            <p className="m-0">
                                                Our premine program enables users to earn xRIV tokens which can be redeemed during TGE (Token Generation Event). This is different from retroactive rewards for the early supporters of Rivera.
                                            </p>
                                        </AccordionTab>
                                        <AccordionTab header="I need more clarifications, what should I do?">
                                            <p className="m-0">
                                                Read our <a href="https://rivera.gitbook.io/docs/tokenomics/usdriv" target="_blank" rel="noopener noreferrer">docs</a> or ask the team in our <a href="https://discord.com/invite/sbMxwS6VEV" target="_blank" rel="noopener noreferrer">discord</a>.
                                            </p>
                                        </AccordionTab>
                                    </Accordion>

                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Reward;

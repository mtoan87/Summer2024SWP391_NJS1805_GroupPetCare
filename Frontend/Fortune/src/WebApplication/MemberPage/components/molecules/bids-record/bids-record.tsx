import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../../../config/axios';
import './bids-record.scss';
import { message, Modal, Button, Table } from 'antd';

function MemberBidsRecord() {
    const [bidRecords, setBidRecords] = useState([]);
    const [auctionResult, setAuctionResult] = useState(null);
    const [error, setError] = useState(null);
    const [price, setPrice] = useState(0);
    const [fee, setFee] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [payments, setPayments] = useState([]);
    const location = useLocation();
    const { auction, bidId } = location.state || {};

    const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
    const accountId = loginedUser?.accountId;

    useEffect(() => {
        const fetchAuctionResult = async () => {
            try {
                const response = await api.get(`/api/AuctionResults/GetByAccountId/${accountId}`);
                const auctionResults = response.data?.$values || [];
                const result = auctionResults.find(result => result.joinauctionId === auction.id);
                setAuctionResult(result);
            } catch (error) {
                console.error('Error fetching auction results:', error);
                setError('Failed to fetch auction results. Please try again later.');
            }
        };

        if (accountId && auction) {
            fetchAuctionResult();
        }
    }, [accountId, auction]);

    useEffect(() => {
        const fetchBidRecords = async () => {
            try {
                const response = await api.get(`/api/BidRecord/GetBidRecordByAccountIdAndBidId`, {
                    params: {
                        accountId,
                        bidId,
                    },
                });
                setBidRecords(response.data?.$values || []);
            } catch (error) {
                console.error('Error fetching bid records:', error);
                setError('Failed to fetch bid records. Please try again later.');
            }
        };

        if (accountId && bidId) {
            fetchBidRecords();
        }
    }, [accountId, bidId]);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await api.get('/api/Payment/GetAllPayments');
                setPayments(response.data?.$values || []);
            } catch (error) {
                console.error('Error fetching payments:', error);
                setError('Failed to fetch payments. Please try again later.');
            }
        };

        fetchPayments();
    }, []);

    const handlePay = () => {
        if (auctionResult) {
            const price = auctionResult.price;
            const fee = price * 0.3;
            const total = price + fee;
            setPrice(price);
            setFee(fee);
            setTotalPrice(total);
            setIsModalVisible(true);
        }
    };

    const handleConfirmPayment = async () => {
        try {
            await api.post('/api/Payment/CreatePayment', {
                accountId: accountId,
                auctionResultId: auctionResult.auctionresultId
            });
            message.success(`Payment of ${totalPrice}$ was successful.`);
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error processing payment:', error);
            message.error('This payment has been paid');
        }
    };

    const handleCancelPayment = () => {
        setIsModalVisible(false);
    };

    const paymentExists = payments.some(payment => payment.auctionResultId === auctionResult?.auctionresultId);

    const columns = [
        {
            title: 'No',
            dataIndex: 'index',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Bid Step',
            dataIndex: 'bidStep',
            key: 'bidStep',
            render: (amount) => `${amount}$`,
        },
        {
            title: 'Bid Amount',
            dataIndex: 'bidAmount',
            key: 'bidAmount',
            render: (amount) => `${amount}$`,
        }

    ];

    return (
        <div className="member-bids-record-container">
            <h1>Bid Records</h1>
            {error && <p className="error-message">{error}</p>}
            {auctionResult && (
                <div className="auction-result-details">
                    <img src={`https://localhost:44361/${auction.imageUrl}`} alt={auction.jewelryName} className="jewelry-image" />
                    <label>{auction.jewelryName}</label>
                    <p>Status: {auctionResult.status}</p>
                    <p>Join Date: {new Date(auction.joindate).toLocaleDateString()}</p>
                    <p>Time: {new Date(auction.joindate).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}</p>
                    {auctionResult.status === 'Win' && !paymentExists && (
                        <div>
                            <Button type="primary" onClick={handlePay}>Pay</Button>
                        </div>
                    )}
                </div>
            )}
            <Table
                columns={columns}
                dataSource={bidRecords}
                rowKey="id"
                pagination={false}
                className="bids-record-table"
            />
            <Modal
                title="Payment Details"
                visible={isModalVisible}
                onOk={handleConfirmPayment}
                onCancel={handleCancelPayment}
                footer={[
                    <Button key="cancel" onClick={handleCancelPayment}>Cancel</Button>,
                    <Button key="pay" type="primary" onClick={handleConfirmPayment}>Confirm</Button>,
                ]}
            >
                <p>Price: {price}$</p>
                <p>Fee (30%): {fee}$</p>
                <p>Total: {totalPrice}$</p>
            </Modal>
        </div>
    );
}

export default MemberBidsRecord;

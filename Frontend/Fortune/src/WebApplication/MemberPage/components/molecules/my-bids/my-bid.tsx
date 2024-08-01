import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../../../config/axios';
import './my-bid.scss';

function MyBids() {
  const [auctionsData, setAuctionsData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser') || '{}');
  const accountId = loginedUser?.accountId;

  const fetchAuctionImage = async (auction) => {
    try {
      const { jewelryGoldId, jewelrySilverId, jewelryGolddiaId } = auction;
      let apiUrl;

      if (jewelryGoldId) {
        apiUrl = `/api/JewelryGold/GetById/${jewelryGoldId}`;
      } else if (jewelrySilverId) {
        apiUrl = `/api/JewelrySilver/GetById/${jewelrySilverId}`;
      } else if (jewelryGolddiaId) {
        apiUrl = `/api/JewelryGoldDia/GetById/${jewelryGolddiaId}`;
      }

      if (apiUrl) {
        const response = await api.get(apiUrl);
        const imageUrl = response.data?.jewelryImg;
        const jewelryName = response.data?.name;
        return { imageUrl, jewelryName };
      }
    } catch (err) {
      console.error('Error fetching auction image:', err);
    }
  };

  useEffect(() => {
    const fetchAuctionData = async () => {
      try {
        const joinAuctionResponse = await api.get(`/api/JoinAuction/GetByAccountId/${accountId}`);
        const joinAuctions = joinAuctionResponse.data?.$values || [];

        const auctionResultResponse = await api.get(`/api/AuctionResults/GetByAccountId/${accountId}`);
        const auctionResults = auctionResultResponse.data?.$values || [];

        //LATEST JOIN AUCTION FOR EACH AUCTION
        const latestJoinAuctions = joinAuctions.reduce((acc, current) => {
          const existing = acc.find(item => item.auctionId === current.auctionId);
          if (!existing || new Date(existing.joindate) < new Date(current.joindate)) {
            return acc.filter(item => item.auctionId !== current.auctionId).concat(current);
          }
          return acc;
        }, []);

        const auctionDetailsPromises = latestJoinAuctions.map(async (auction) => {
          const auctionResponse = await api.get(`/api/Auctions/GetById/${auction.auctionId}`);
          const auctionDetails = auctionResponse.data;

          const { imageUrl, jewelryName } = await fetchAuctionImage(auctionDetails);
          const auctionResult = auctionResults.find(result => result.joinAuctionId === auction.id);

          return {
            ...auction,
            ...auctionDetails,
            imageUrl,
            jewelryName,
            status: auctionResult?.status || 'Unknown',
          };
        });

        const auctionsData = await Promise.all(auctionDetailsPromises);
        setAuctionsData(auctionsData);
      } catch (error) {
        console.error('Error fetching auction data:', error);
        setError('Failed to fetch auction data. Please try again later.');
      }
    };

    fetchAuctionData();
  }, [accountId]);

  const handleAuctionClick = (auction) => {
    navigate('/bids-record', { state: { auction } });
  };

  return (
    <div className="my-bids-container">
      <h1>My Bids</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="join-auctions-list">
        {auctionsData.length === 0 ? (
          <p>No auction results found for this account.</p>
        ) : (
          auctionsData.map((auction) => (
            <div key={auction.id} className="auction-item-bids" onClick={() => handleAuctionClick(auction)}>
              <div className="auction-details">
                <img src={`https://localhost:44361/${auction.imageUrl}`} alt={auction.jewelryName} className="jewelry-image" />
                <label>{auction.jewelryName}</label>
                <p>Status: {auction.status}</p>
                <p>Join Date: {new Date(auction.joindate).toLocaleDateString()}</p>
                <p>Time: {new Date(auction.joindate).toLocaleTimeString('en-us', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MyBids;

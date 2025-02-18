import { useEffect, useState } from 'react';
import './member-jewelry.scss';
import api from '../../../../../config/axios';
import { useNavigate } from 'react-router-dom';

function MemberJewelry() {
  const [jewelry, setJewelry] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchJewelry = async () => {
      try {
        const response = await api.get('/api/Jewelries/GetVerified');
        const { jewelrySilver, jewelryGold, jewelryGoldDiamond } = response.data;

        const combinedJewelry = [
          ...(jewelrySilver?.$values || []),
          ...(jewelryGold?.$values || []),
          ...(jewelryGoldDiamond?.$values || [])
        ];

        setJewelry(combinedJewelry);
      } catch (err) {
        console.error('Error fetching jewelry', err);
      }
    };

    fetchJewelry();
  }, []);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(jewelry.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = jewelry.slice(startIndex, startIndex + itemsPerPage);

  const handleJewelryClick = (jewelryId,type) => {
    navigate(`/jewelry/${jewelryId}/${type}`);
  };

  return (
    <>
      <div className="member-jewel-content">
        <h1>JEWELRY</h1>
      </div>
      <div className="member-jewelry-container">
        {displayedItems.map((item, index) => {
          const key = item.jewelrySilverId
            ? `silver-${item.jewelrySilverId}`
            : item.jewelryGoldId
            ? `gold-${item.jewelryGoldId}`
            : `diamond-${item.jewelryGolddiaId}`;
          return (
            <div
              key={key}
              className="member-jewelry-item"
              onClick={() =>handleJewelryClick(
                item.jewelrySilverId || item.jewelryGoldId || item.jewelryGolddiaId,
                item.jewelrySilverId ? 'silver' : item.jewelryGoldId ? 'gold' : 'goldDia'
              )}
            >
              <img
                src={`https://localhost:44361/${item.jewelryImg}`}
                alt={item.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <label>{item.name}</label>
              <p>Description: {item.description}</p>
              {item.jewelryGoldId && <p>Gold Age: {item.goldAge}</p>}
              {item.jewelryGolddiaId && (
                <>
                  <p>Clarity: {item.clarity}</p>
                  <p>Carat: {item.carat}</p>
                  <p>Gold Age: {item.goldAge}</p>
                </>
              )}
              {item.jewelrySilverId && <p>Purity: {item.purity}</p>}
              <p>Materials: {item.materials}</p>
              <p>Weight: {item.weight}</p>
              <p className="price">{item.price}$</p>
            </div>
          );
        })}
      </div>
      <div className="member-navigation-buttons">
        <button onClick={prevPage} disabled={currentPage === 1}>
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => goToPage(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
        <button onClick={nextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </>
  );
}

export default MemberJewelry;

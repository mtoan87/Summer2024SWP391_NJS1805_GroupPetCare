import { useEffect, useState } from 'react';
import './view-jewelry.scss'; // Assuming you have SCSS for styling
import api from '../../../../../config/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { message, Select, InputNumber, Button } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';

const { Option } = Select;

function StaffViewJewelry() {
  const [goldJewelry, setGoldJewelry] = useState([]);
  const [silverJewelry, setSilverJewelry] = useState([]);
  const [golddiaJewelry, setGoldDiaJewelry] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [goldAgeFilter, setGoldAgeFilter] = useState('');
  const [purityFilter, setPurityFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [clarityFilter, setClarityFilter] = useState('');
  const [caratFilter, setCaratFilter] = useState('');
  const [minWeight, setMinWeight] = useState(null);
  const [maxWeight, setMaxWeight] = useState(null);
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const successMessage = state && state.successMessage;

  useEffect(() => {
    const fetchGoldJewelry = async () => {
      try {
        const response = await api.get(`api/JewelryGold`);
        setGoldJewelry(response.data?.$values || []); 
      } catch (err) {
        console.error('Error fetching Gold jewelry', err);
        setGoldJewelry([]);
      }
    };

    const fetchSilverJewelry = async () => {
      try {
        const response = await api.get(`api/JewelrySilver`);
        setSilverJewelry(response.data?.$values || []); 
      } catch (err) {
        console.error('Error fetching Silver jewelry', err);
        setSilverJewelry([]);
      }
    };

    const fetchGoldDiaJewelry = async () => {
      try {
        const response = await api.get(`/api/JewelryGoldDia`);
        setGoldDiaJewelry(response.data?.$values || []); 
      } catch (err) {
        console.error('Error fetching Gold Dia jewelry', err);
        setGoldDiaJewelry([]);
      }
    };

    if (accountId) {
      fetchGoldJewelry();
      fetchSilverJewelry();
      fetchGoldDiaJewelry();
    } else {
      console.error('No accountId found in loginedUser');
    }
  }, [accountId]);

  useEffect(() => {
    if (successMessage) {
      message.success("Success Notification!");
    }
  }, [successMessage]);

  const handleUpdateJewelry = (jewelryId, material) => {
    navigate(`/staff/update-jewelry/${jewelryId}/${material}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleGoldAgeChange = (value) => {
    setGoldAgeFilter(value);
  };

  const handlePurityChange = (value) => {
    setPurityFilter(value);
  };

  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
  };

  const handleMaterialChange = (value) => {
    setMaterialFilter(value);
  };

  const handleMinWeightChange = (value) => {
    setMinWeight(value);
  };

  const handleMaxWeightChange = (value) => {
    setMaxWeight(value);
  };
  const handleCaratChange = (value) => {
    setCaratFilter(value);
  };
  const handleClarityChange = (value) => {
    setClarityFilter(value);
  };
  const clearFilters = () => {
    setGoldAgeFilter('');
    setPurityFilter('');
    setCategoryFilter('');
    setMaterialFilter('');
    setMinWeight(null);
    setMaxWeight(null);
    setClarityFilter('');
    setCaratFilter('');
    setSearchQuery('');
  };

  const filterJewelry = (jewelry) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const isGoldAgeMatch = !goldAgeFilter || jewelry.goldAge === goldAgeFilter;
    const isPurityMatch = !purityFilter || jewelry.purity === purityFilter;
    const isCategoryMatch = !categoryFilter || jewelry.category === categoryFilter;
    const isMaterialMatch = !materialFilter || (jewelry.materials && jewelry.materials.toLowerCase().includes(materialFilter.toLowerCase()));
    const isWeightMatch = (!minWeight || jewelry.weight >= minWeight) && (!maxWeight || jewelry.weight <= maxWeight);
    const isClarityMatch = !clarityFilter || jewelry.clarity === clarityFilter;
    const isCaratMatch = !caratFilter || jewelry.carat === caratFilter;
    return (
      (jewelry.name && jewelry.name.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.description && jewelry.description.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.collection && jewelry.collection.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.goldAge && jewelry.goldAge.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.materials && jewelry.materials.toLowerCase().includes(lowerCaseQuery)) ||
      (jewelry.weight && jewelry.weight.toString().toLowerCase().includes(lowerCaseQuery))
    ) && isGoldAgeMatch && isPurityMatch && isCategoryMatch && isMaterialMatch && isWeightMatch && isClarityMatch && isCaratMatch;
  };

  return (
    <>
      <div className="jewel-content">
        <h1>Jewelry</h1>
      </div>
      <div className='searchBar'>
        <div className="fui-input-label-animation">
          <SearchOutlined className="search-icon" />
          <input 
            type="text" 
            className="form-input" 
            placeholder='Search for Jewelry' 
            value={searchQuery}
            onChange={handleSearchChange} 
          />
        </div>
      </div>
      <div className="filters">
      <Select
          placeholder="Select Clarity"
          onChange={handleClarityChange}
          allowClear
          className="filter-item"
          value={clarityFilter || undefined}
        >
          <Option value="VVS">VVS</Option>
          <Option value="VS">VS</Option>
          <Option value="SI">SI</Option>
          <Option value="I">I</Option>
        </Select>
        <Select
          placeholder="Select Gold Age"
          onChange={handleGoldAgeChange}
          allowClear
          className="filter-item"
          value={goldAgeFilter || undefined}  // Ensure placeholder shows when goldAgeFilter is empty
        >
          <Option value="14K">14K</Option>
          <Option value="18K">18K</Option>
          <Option value="20K">20K</Option>
          <Option value="22K">22K</Option>
          <Option value="24K">24K</Option>
        </Select>
        <Select
          placeholder="Select Purity"
          onChange={handlePurityChange}
          allowClear
          className="filter-item"
          value={purityFilter || undefined}  // Ensure placeholder shows when purityFilter is empty
        >
          <Option value="92.5%">92.5%</Option>
          <Option value="99.9%">99.9%</Option>
          <Option value="90%">90%</Option>
          <Option value="95.8%">95.8%</Option>
        </Select>
        <Select
          placeholder="Select Category"
          onChange={handleCategoryChange}
          allowClear
          className="filter-item"
          value={categoryFilter || undefined}  // Ensure placeholder shows when categoryFilter is empty
        >
          <Option value="Ring">Ring</Option>
          <Option value="Necklace">Necklace</Option>
          <Option value="Bracelet">Bracelet</Option>
          <Option value="Earrings">Earrings</Option>
        </Select>
        <Select
          placeholder="Select Material"
          onChange={handleMaterialChange}
          allowClear
          className="filter-item"
          value={materialFilter || undefined}  // Ensure placeholder shows when materialFilter is empty
        >
          <Option value="Gold">Gold</Option>
          <Option value="Silver">Silver</Option>
          <Option value="Diamond">Gold Diamond</Option>
        </Select>
        <Select
          placeholder="Select Carat"
          onChange={handleCaratChange}
          allowClear
          className="filter-item"
          value={caratFilter || undefined}
        >
          <Option value="1ct">1ct</Option>
          <Option value="2ct">2ct</Option>
          <Option value="3ct">3ct</Option>
          <Option value="4ct">4ct</Option>
        </Select>
        <InputNumber
          placeholder="Min Weight"
          min={0}
          value={minWeight}
          onChange={handleMinWeightChange}
          className="filter-item"
        />
        <InputNumber
          placeholder="Max Weight"
          min={0}
          value={maxWeight}
          onChange={handleMaxWeightChange}
          className="filter-item"
        />
        <Button
          onClick={clearFilters}
          className="filter-item"
        >
          Clear Filters
        </Button>
      </div>
      <div className="jewelry-container">
        {/* Render gold jewelry items */}
        {goldJewelry.length > 0 && (
          goldJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Gold Age: {jewelry.goldAge.replace('Gold', '')}k</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <p>Shipment: {jewelry.shipment}</p>
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelryGoldId, "Gold")}>
                  <EditOutlined /> Update
                </button>
              </div>
            </div>
          ))
        )}
        {/* Render silver jewelry items */}
        {silverJewelry.length > 0 && (
          silverJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelrySilverId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Purity: {jewelry.purity}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <p>Shipment: {jewelry.shipment}</p>
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelrySilverId, "Silver")}>
                  <EditOutlined /> Update
                </button>
              </div>
            </div>
          ))
        )}
        {/* Render gold dia jewelry items */}
        {golddiaJewelry.length > 0 && (
          golddiaJewelry.filter(filterJewelry).map((jewelry) => (
            <div key={jewelry.jewelryGoldDiaId} className="jewelry-item">
              <img
                className='item-img'
                src={`https://localhost:44361/${jewelry.jewelryImg}`}
                alt={jewelry.name}
                onError={(e) => { e.target.src = "src/assets/img/jewelry_introduction.jpg"; }}
              />
              <h3>{jewelry.name}</h3>
              <p>Description: {jewelry.description}</p>
              <p>Category: {jewelry.category}</p>
              <p>Gold Age: {jewelry.goldAge.replace('Gold', '')}k</p>
              <p>Clarity: {jewelry.clarity}</p>
              <p>Carat: {jewelry.carat}</p>
              <p>Materials: {jewelry.materials}</p>
              <p>Weight: {jewelry.weight}</p>
              <p>Price: {jewelry.price}$</p>
              <p>Shipment: {jewelry.shipment}</p>
              <div className="jewelry-item-buttons">
                <button onClick={() => handleUpdateJewelry(jewelry.jewelryGolddiaId, "GoldDia")}>
                  <EditOutlined /> Update
                </button>
              </div>
            </div>
          ))
        )}
        {!(goldJewelry.length > 0 || silverJewelry.length > 0 || golddiaJewelry.length > 0) && (
          <div className="no-results">
            <p>No jewelry found.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default StaffViewJewelry;

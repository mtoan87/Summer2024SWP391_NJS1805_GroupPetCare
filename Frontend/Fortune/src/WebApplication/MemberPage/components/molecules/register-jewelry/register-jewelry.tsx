import React, { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import './register-jewelry.scss';
import api from '../../../../../config/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function RegisterJewelryForAuction() {
  const navigate = useNavigate();
  const location = useLocation();
  const { jewelryId } = location.state || {};
  const { material } = useParams();
  const loginedUser = JSON.parse(sessionStorage.getItem('loginedUser'));
  const accountId = loginedUser?.accountId;

  const initialFormData = {
    accountId: accountId,
    jewelryGoldId: material === 'Gold' ? jewelryId : null,
    jewelrySilverId: material === 'Silver' ? jewelryId : null,
    date: '',
    startTime: '',
    endTime: '',
    jewelryDetails: {}
  };


  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchJewelryDetails = async () => {
      try {
        let response;
        if (material === 'Gold') {
          response = await api.get(`/api/JewelryGold/GetById/${jewelryId}`);
        } else if (material === 'Silver') {
          response = await api.get(`/api/JewelrySilver/GetById/${jewelryId}`);
        } else {
          console.error('Unsupported jewelry material type');
          return;
        }

        console.log(response.data);
        setFormData(prevState => ({
          ...prevState,
          jewelryDetails: {
            ...response.data,
            materials: material
          }
        }));
      } catch (error) {
        console.error('Error fetching jewelry details:', error);
      }
    };

    if (jewelryId) {
      fetchJewelryDetails();
    }
  }, [jewelryId, material]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the date is at least 3 days from today
    const chosenDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 3);

    if (chosenDate < minDate) {
      toast.error('The auction date must be at least 3 days from today.', { position: 'top-right' });
      return;
    }

    // Validate end time is at least 30 minutes after start time
    const [startHours, startMinutes] = formData.startTime.split(':').map(Number);
    const [endHours, endMinutes] = formData.endTime.split(':').map(Number);
    const startDateTime = new Date(chosenDate);
    const endDateTime = new Date(chosenDate);

    startDateTime.setHours(startHours, startMinutes, 0, 0);
    endDateTime.setHours(endHours, endMinutes, 0, 0);

    const timeDifference = (endDateTime - startDateTime) / (1000 * 60); // Difference in minutes

    if (timeDifference < 30) {
      toast.error('The auction must take part at least 30 minutes.', { position: 'top-right' });
      return;
    }

    // Create date strings without timezone offsets
    const formatISOWithoutTimezone = (date) => {
      return date.toISOString().split('Z')[0];
    };

    const starttime = formatISOWithoutTimezone(startDateTime);
    const endtime = formatISOWithoutTimezone(endDateTime);

    try {
      const requestData = {
        accountId: accountId,
        starttime: starttime,
        endtime: endtime
      };

      if (material === 'Gold') {
        requestData.jewelryGoldId = formData.jewelryGoldId;
      } else if (material === 'Silver') {
        requestData.jewelrySilverId = formData.jewelrySilverId;
      } else if (material === 'GoldDiamong') {
        requestData.jewelryGolddiaIdId = formData.jewelryGolddiaId;
      }
      else {
        console.error('Unsupported jewelry material type');
        return;
      }

      const apiUrl = material === 'Gold' ? '/api/Auctions/CreateGoldJewelryAuction' : '/api/Auctions/CreateSilverJewelryAuction';

      const response = await api.post(apiUrl, requestData);
      console.log('Auction created successfully:', response.data);
      toast.success('Auction registered successfully!', { position: 'top-right' });

      // Clear form data
      setFormData(initialFormData);

      // Delayed navigation after toast appears
      setTimeout(() => {
        navigate('/userJewel');
      }, 1000);
    } catch (error) {
      console.error('Error creating auction:', error);
      if (error.response && error.response.data) {
        console.error('Response Data:', error.response.data);
      }
      toast.error('Error creating auction. Please try again!', { position: 'top-right' });
    }
  };


  return (
    <div className="register-jewelry-form">
      <h2>Auction Register</h2>
      {jewelryId ? (
        <>
          <div className="jewelry-details">
            <h3>Jewelry Details:</h3>
            <p>
              Image:{' '}
              <img
                src={`https://localhost:44361/${formData.jewelryDetails.jewelryImg}`}
                alt={formData.jewelryDetails.name}
                onError={e => {
                  e.target.src = '../../../../../../src/assets/img/jewelry_introduction.jpg';
                }}
              />
            </p>
            <p>Name: {formData.jewelryDetails.name}</p>
            <p>Description: {formData.jewelryDetails.description}</p>
            <p>Category: {formData.jewelryDetails.category}</p>
            {material === 'gold' && (
              <p>Gold Age: {formData.jewelryDetails.goldAge}</p>
            )}
            {material === 'silver' && (
              <p>Purity: {formData.jewelryDetails.purity}</p>
            )}
            <p>Materials: {formData.jewelryDetails.materials}</p>
            <p>Weight: {formData.jewelryDetails.weight}</p>
            <p>Price: {formData.jewelryDetails.price}$</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="startTime">Start Time</label>
              <input
                type="time"
                id="startTime"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="endTime">End Time</label>
              <input
                type="time"
                id="endTime"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Register Auction</button>
          </form>
        </>
      ) : (
        <p>No jewelry selected for auction registration.</p>
      )}
      <ToastContainer className="toast-position" />
    </div>
  );
}

export default RegisterJewelryForAuction;

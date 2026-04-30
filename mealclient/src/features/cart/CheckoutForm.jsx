import React from 'react';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Button, Box, Typography, Alert, CircularProgress
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from './cartSlice';
import { useCreateOrderMutation } from '../orders/ordersApi';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Full name is required'),
  address: Yup.string().required('Delivery address is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required'),
});

const CheckoutForm = ({ open, onClose, onSuccess }) => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      const orderData = {
        ...values,
        items: items.map(i => ({ id: i.id, quantity: i.quantity }))
      };
      
      const result = await createOrder(orderData).unwrap();
      dispatch(clearCart());
      onSuccess();
      navigate(`/order/${result.orderId}`);
    } catch (err) {
      setStatus(err.data?.message || 'Failed to place order. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, textAlign: 'center', pt: 4 }}>
        Delivery Details
      </DialogTitle>
      <Formik
        initialValues={{ name: '', address: '', phone: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, handleBlur, isValid, dirty, status }) => (
          <Form>
            <DialogContent sx={{ px: 4 }}>
              {status && <Alert severity="error" sx={{ mb: 2 }}>{status}</Alert>}
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                margin="normal"
                variant="outlined"
                placeholder="John Doe"
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Delivery Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                margin="normal"
                variant="outlined"
                multiline
                rows={3}
                placeholder="123 Foodie St, Flavor Town"
                disabled={isLoading}
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={touched.phone && errors.phone}
                margin="normal"
                variant="outlined"
                placeholder="1234567890"
                disabled={isLoading}
              />
              <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  By placing this order, you agree to our terms of service and delivery policy.
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions sx={{ p: 4, pt: 0 }}>
              <Button onClick={onClose} disabled={isLoading} sx={{ fontWeight: 700 }}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                disabled={isLoading || !isValid || !dirty}
                sx={{ px: 4, py: 1.5, borderRadius: 2, fontWeight: 800 }}
              >
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Confirm Order'}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default CheckoutForm;

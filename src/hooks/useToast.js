import { useDispatch } from 'react-redux';
import { addToast } from '../redux/uiSlice';
import { useCallback } from 'react';

export function useToast() {
  const dispatch = useDispatch();

  const toast = useCallback((options) => {
    dispatch(addToast(options));
  }, [dispatch]);

  const success = useCallback((title, message) => {
    dispatch(addToast({ type: 'success', title, message }));
  }, [dispatch]);

  const error = useCallback((title, message) => {
    dispatch(addToast({ type: 'error', title, message }));
  }, [dispatch]);

  const warning = useCallback((title, message) => {
    dispatch(addToast({ type: 'warning', title, message }));
  }, [dispatch]);

  const info = useCallback((title, message) => {
    dispatch(addToast({ type: 'info', title, message }));
  }, [dispatch]);

  return { toast, success, error, warning, info };
}

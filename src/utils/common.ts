import { Toast } from '@douyinfe/semi-ui';

// 通用的正确弹窗
export function ToastSuccess(content: string, duration = 4) {
  return Toast.success({
    content: content,
    duration,
    showClose: false,
  });
}

// 通用的信息弹窗
export function ToastInfo(content: string, duration = 3, icon?: React.ReactNode) {
  return Toast.info({
    content: content,
    duration,
    showClose: false,
    icon,
  });
}

// 通用的错误弹窗
export function ToastError(content: string, duration = 4) {
  return Toast.error({
    content: content || 'Error',
    duration,
    showClose: false,
  });
}
// 通用的警告弹窗
export function ToastWaring(content: string, duration = 4) {
  return Toast.warning({
    content: content || 'Warning',
    duration,
    showClose: false,
  });
}

export const handleCopy = (text: string) => {
  navigator.clipboard.writeText(text).then(
    () => {
      ToastSuccess('复制成功');
    },
    (err) => {
      ToastError('复制失败');
    },
  );
};

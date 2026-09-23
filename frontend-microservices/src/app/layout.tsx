import React from 'react';
import type { Metadata } from 'next';
import ThemeRegistry from '@/theme/ThemeRegistry';
import { AuthProvider } from '@/hooks/useAuth';
import { NotificationProvider } from '@/hooks/useNotification';
import { AppNavbar } from '@/components';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'NovaCommerce — E-Commerce Microservices',
  description: 'Giao diện quản lý E-Commerce Microservices xây dựng bằng Next.js và MUI UI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <ThemeRegistry>
          <NotificationProvider>
            <AuthProvider>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  backgroundColor: 'background.default',
                }}
              >
                {/* Thanh điều hướng chính */}
                <AppNavbar />

                {/* Nội dung trang */}
                <Container
                  component="main"
                  maxWidth="xl"
                  sx={{
                    flex: 1,
                    py: 4,
                  }}
                >
                  {children}
                </Container>

                {/* Footer đơn giản, tinh tế */}
                <Box
                  component="footer"
                  sx={{
                    py: 3,
                    px: 2,
                    mt: 'auto',
                    backgroundColor: '#ffffff',
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center',
                  }}
                >
                  <Container maxWidth="xl">
                    <Typography variant="body2" color="text.secondary">
                      © {new Date().getFullYear()} NovaCommerce Microservices. Spring Cloud Ecosystem & Next.js.
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                      API Gateway: <strong>http://localhost:9191</strong> | Eureka | Config Server | Redis | Elasticsearch | AWS S3
                    </Typography>
                  </Container>
                </Box>
              </Box>
            </AuthProvider>
          </NotificationProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}

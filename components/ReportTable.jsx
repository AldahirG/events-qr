import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReportTable = ({ title, data = [], renderItem, renderFooter, emptyMessage }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      {data.length > 0 ? (
        <>
          {data.map((item, index) => renderItem({ item, index }))}
          {renderFooter && renderFooter(data)}
        </>
      ) : (
        <Text style={styles.noDataText}>{emptyMessage || 'No hay datos disponibles.'}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
    borderColor: '#dee2e6',
    borderWidth: 1,
    elevation: 2,
    paddingVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataText: {
    textAlign: 'center',
    color: '#6c757d',
    fontSize: 16,
    marginVertical: 10,
  },
});

export default ReportTable;

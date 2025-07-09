import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Componentes principais
const DashboardScreen = () => {
  const [stats, setStats] = useState({
    totalCreditos: 0,
    totalValor: 0,
    oportunidades: 0,
    economia: 0
  });

  useEffect(() => {
    // Simular carregamento de dados
    setTimeout(() => {
      setStats({
        totalCreditos: 156,
        totalValor: 45200000,
        oportunidades: 23,
        economia: 1850000
      });
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tributa.AI</Text>
          <Text style={styles.headerSubtitle}>Dashboard Executivo</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="account-balance" size={30} color="#3B82F6" />
            <Text style={styles.statValue}>{stats.totalCreditos}</Text>
            <Text style={styles.statLabel}>Títulos de Crédito</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="attach-money" size={30} color="#10B981" />
            <Text style={styles.statValue}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact'
              }).format(stats.totalValor)}
            </Text>
            <Text style={styles.statLabel}>Valor Total</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="trending-up" size={30} color="#F59E0B" />
            <Text style={styles.statValue}>{stats.oportunidades}</Text>
            <Text style={styles.statLabel}>Oportunidades</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="savings" size={30} color="#EF4444" />
            <Text style={styles.statValue}>
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                notation: 'compact'
              }).format(stats.economia)}
            </Text>
            <Text style={styles.statLabel}>Economia Potencial</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="add-circle" size={24} color="#fff" />
            <Text style={styles.actionText}>Tokenizar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="swap-horiz" size={24} color="#fff" />
            <Text style={styles.actionText}>Compensar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Icon name="store" size={24} color="#fff" />
            <Text style={styles.actionText}>Marketplace</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const MarketplaceScreen = () => {
  const [anuncios, setAnuncios] = useState([]);

  useEffect(() => {
    // Simular carregamento de anúncios
    setAnuncios([
      {
        id: 'tc-001',
        titulo: 'Crédito ICMS - Ind. Metalúrgica',
        valor: 2500000,
        desconto: 15,
        categoria: 'ICMS',
        emissor: 'ABC Metalúrgica'
      },
      {
        id: 'tc-002',
        titulo: 'PIS/COFINS - Exportação',
        valor: 1800000,
        desconto: 12,
        categoria: 'PIS_COFINS',
        emissor: 'XYZ Energia'
      }
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <Text style={styles.headerSubtitle}>Títulos de Crédito</Text>
      </View>

      <ScrollView style={styles.marketplaceList}>
        {anuncios.map((anuncio) => (
          <TouchableOpacity key={anuncio.id} style={styles.anuncioCard}>
            <View style={styles.anuncioHeader}>
              <Text style={styles.anuncioTitulo}>{anuncio.titulo}</Text>
              <View style={styles.categoriaTag}>
                <Text style={styles.categoriaText}>{anuncio.categoria}</Text>
              </View>
            </View>

            <Text style={styles.anuncioEmisor}>Emissor: {anuncio.emissor}</Text>
            
            <View style={styles.anuncioFooter}>
              <Text style={styles.anuncioValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(anuncio.valor)}
              </Text>
              <Text style={styles.anuncioDesconto}>-{anuncio.desconto}%</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const TokenizationScreen = () => {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 6) {
      setStep(step + 1);
    } else {
      Alert.alert('Sucesso!', 'Tokenização iniciada com sucesso!');
      setStep(1);
    }
  };

  const steps = [
    'Dados Básicos',
    'Documentação',
    'Validação Fiscal',
    'Compliance',
    'Blockchain',
    'Finalização'
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tokenização</Text>
        <Text style={styles.headerSubtitle}>Etapa {step} de 6: {steps[step - 1]}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: `${(step / 6) * 100}%` }]} />
        </View>
      </View>

      <ScrollView style={styles.formContainer}>
        <View style={styles.stepCard}>
          <Icon name="description" size={40} color="#3B82F6" />
          <Text style={styles.stepTitle}>{steps[step - 1]}</Text>
          <Text style={styles.stepDescription}>
            {step === 1 && 'Informe os dados básicos do título de crédito'}
            {step === 2 && 'Anexe os documentos comprobatórios'}
            {step === 3 && 'Validação automática com Receita Federal'}
            {step === 4 && 'Verificação de compliance e KYC'}
            {step === 5 && 'Criação do token na blockchain'}
            {step === 6 && 'Revisão final e confirmação'}
          </Text>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={handleNext}>
          <Text style={styles.primaryButtonText}>
            {step === 6 ? 'Finalizar Tokenização' : 'Próxima Etapa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const CompensacaoScreen = () => {
  const [oportunidades, setOportunidades] = useState([]);

  useEffect(() => {
    // Simular busca de oportunidades
    setOportunidades([
      {
        id: 'comp-001',
        tipo: 'ICMS',
        credito: 500000,
        debito: 450000,
        economia: 67500
      },
      {
        id: 'comp-002',
        tipo: 'PIS/COFINS',
        credito: 300000,
        debito: 280000,
        economia: 42000
      }
    ]);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Compensação</Text>
        <Text style={styles.headerSubtitle}>Oportunidades Identificadas</Text>
      </View>

      <ScrollView style={styles.compensacaoList}>
        {oportunidades.map((opp) => (
          <View key={opp.id} style={styles.oportunidadeCard}>
            <View style={styles.oportunidadeHeader}>
              <Text style={styles.oportunidadeTipo}>{opp.tipo}</Text>
              <Icon name="check-circle" size={20} color="#10B981" />
            </View>

            <View style={styles.oportunidadeBody}>
              <Text style={styles.oportunidadeLabel}>Crédito Disponível:</Text>
              <Text style={styles.oportunidadeValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(opp.credito)}
              </Text>

              <Text style={styles.oportunidadeLabel}>Débito a Compensar:</Text>
              <Text style={styles.oportunidadeValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(opp.debito)}
              </Text>

              <Text style={styles.economiaLabel}>Economia Estimada:</Text>
              <Text style={styles.economiaValor}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(opp.economia)}
              </Text>
            </View>

            <TouchableOpacity style={styles.compensarButton}>
              <Text style={styles.compensarButtonText}>Iniciar Compensação</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

// Navegação principal
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === 'Dashboard') {
          iconName = 'dashboard';
        } else if (route.name === 'Marketplace') {
          iconName = 'store';
        } else if (route.name === 'Tokenização') {
          iconName = 'add-circle';
        } else if (route.name === 'Compensação') {
          iconName = 'swap-horiz';
        }

        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#3B82F6',
      tabBarInactiveTintColor: 'gray',
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Marketplace" component={MarketplaceScreen} />
    <Tab.Screen name="Tokenização" component={TokenizationScreen} />
    <Tab.Screen name="Compensação" component={CompensacaoScreen} />
  </Tab.Navigator>
);

// App principal
const TributaAIApp = () => {
  return (
    <NavigationContainer>
      <MainTabs />
    </NavigationContainer>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10,
  },
  statCard: {
    width: (width - 30) / 2,
    backgroundColor: '#fff',
    padding: 15,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
  marketplaceList: {
    flex: 1,
    padding: 15,
  },
  anuncioCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  anuncioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  anuncioTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  categoriaTag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoriaText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  anuncioEmisor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  anuncioFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  anuncioValor: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10B981',
  },
  anuncioDesconto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  stepCard: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 15,
    marginBottom: 10,
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  compensacaoList: {
    flex: 1,
    padding: 15,
  },
  oportunidadeCard: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  oportunidadeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  oportunidadeTipo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  oportunidadeBody: {
    marginBottom: 20,
  },
  oportunidadeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 8,
  },
  oportunidadeValor: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  economiaLabel: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 12,
  },
  economiaValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
  },
  compensarButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  compensarButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default TributaAIApp; 
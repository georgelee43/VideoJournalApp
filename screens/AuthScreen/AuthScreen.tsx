// App.tsx - Main Application Entry Point with Supabase Integration
import {
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { styles } from "./styles";

// Authentication Screen (hoisted to top-level to preserve component identity)
type AuthScreenProps = {
  email: string;
  password: string;
  isSignUp: boolean;
  loading: boolean;
  onChangeEmail: (text: string) => void;
  onChangePassword: (text: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
};

export const AuthScreen: React.FC<AuthScreenProps> = ({
  email,
  password,
  isSignUp,
  loading,
  onChangeEmail,
  onChangePassword,
  onSubmit,
  onToggleMode,
}) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={styles.flex1}
  >
    <ScrollView
      contentContainerStyle={styles.authContainer}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.authTitle}>Video Journal</Text>
      <Text style={styles.authSubtitle}>
        {isSignUp ? "Create Account" : "Sign In"}
      </Text>

      <TextInput
        style={styles.authInput}
        placeholder="Email"
        value={email}
        onChangeText={onChangeEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        textContentType="emailAddress"
        autoCorrect={false}
        autoComplete="email"
        returnKeyType="next"
      />

      <TextInput
        style={styles.authInput}
        placeholder="Password"
        value={password}
        onChangeText={onChangePassword}
        secureTextEntry
        textContentType="password"
        autoCorrect={false}
        autoComplete="password"
        returnKeyType="done"
      />

      <TouchableOpacity
        style={styles.authButton}
        onPress={onSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.authButtonText}>
            {isSignUp ? "Sign Up" : "Sign In"}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggleMode}>
        <Text style={styles.authToggle}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
);

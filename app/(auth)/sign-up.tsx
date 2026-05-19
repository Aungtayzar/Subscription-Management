import { useAuth, useSignUp } from "@clerk/expo";
import { type Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// ── Brand tokens ────────────────────────────────────────────────
const CREAM = "#F5F0E8";
const ORANGE = "#D4714A";
const NAVY = "#1A2340";
const SLATE = "#6B7A99";
const WHITE = "#FFFFFF";
const BORDER = "#E2D9CC";

export default function Page() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) {
      console.error(JSON.stringify(error, null, 2));
      return;
    }
    if (!error) await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) {
            const taskRoutes: Record<string, string> = {
              "setup-mfa": "/setup-mfa",
              "choose-organization": "/choose-organization",
              "reset-password": "/reset-password",
            };
            const route = taskRoutes[session.currentTask.key] || "/";
            const taskUrl = decorateUrl(route);
            if (taskUrl.startsWith("http")) {
              window.location.href = taskUrl;
            } else {
              router.push(taskUrl as Href);
            }
            return;
          }
          const url = decorateUrl("/");
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            router.push(url as Href);
          }
        },
      });
    } else {
      console.error("Sign-up attempt not complete:", signUp);
    }
  };

  if (signUp.status === "complete" || isSignedIn) return null;

  // ── Verify screen ──────────────────────────────────────────────
  if (
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.screen}>
          <Logo />
          <View style={styles.card}>
            <Text style={styles.heading}>Verify your account</Text>
            <Text style={styles.sub}>Enter the code we sent to your email</Text>

            <Text style={styles.label}>Verification code</Text>
            <TextInput
              style={styles.input}
              value={code}
              placeholder="Enter your verification code"
              placeholderTextColor={SLATE}
              onChangeText={setCode}
              keyboardType="numeric"
            />
            {errors.fields.code && (
              <Text style={styles.error}>{errors.fields.code.message}</Text>
            )}

            <Pressable
              style={({ pressed }) => [
                styles.btn,
                fetchStatus === "fetching" && styles.btnDisabled,
                pressed && styles.btnPressed,
              ]}
              onPress={handleVerify}
              disabled={fetchStatus === "fetching"}
            >
              <Text style={styles.btnText}>Verify</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.ghostBtn,
                pressed && styles.btnPressed,
              ]}
              onPress={() => signUp.verifications.sendEmailCode()}
            >
              <Text style={styles.ghostText}>Resend code</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ── Main sign-up screen ────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.screen}>
        <Logo />

        <Text style={styles.heading}>Create an account</Text>
        <Text style={styles.sub}>
          Start managing your subscriptions with Recurly
        </Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email address</Text>
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter your email"
            placeholderTextColor={SLATE}
            onChangeText={setEmailAddress}
            keyboardType="email-address"
          />
          {errors.fields.emailAddress && (
            <Text style={styles.error}>
              {errors.fields.emailAddress.message}
            </Text>
          )}

          <Text style={[styles.label, { marginTop: 8 }]}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            placeholder="Enter your password"
            placeholderTextColor={SLATE}
            secureTextEntry
            onChangeText={setPassword}
          />
          {errors.fields.password && (
            <Text style={styles.error}>{errors.fields.password.message}</Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.btn,
              (!emailAddress || !password || fetchStatus === "fetching") &&
                styles.btnDisabled,
              pressed && styles.btnPressed,
            ]}
            onPress={handleSubmit}
            disabled={!emailAddress || !password || fetchStatus === "fetching"}
          >
            <Text style={styles.btnText}>Sign up</Text>
          </Pressable>

          <View style={styles.linkRow}>
            <Text style={styles.linkMuted}>Already have an account? </Text>
            <Link href="/sign-in">
              <Text style={styles.linkAccent}>Sign in</Text>
            </Link>
          </View>
        </View>

        {/* Required for Clerk bot protection */}
        <View nativeID="clerk-captcha" />
      </View>
    </SafeAreaView>
  );
}

// ── Logo component ─────────────────────────────────────────────
function Logo() {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoIcon}>
        <Text style={styles.logoLetter}>R</Text>
      </View>
      <View>
        <Text style={styles.logoName}>Recurly</Text>
        <Text style={styles.logoTag}>SMART BILLING</Text>
      </View>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: CREAM,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: "center",
    backgroundColor: CREAM,
  },

  // Logo
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 36,
  },
  logoIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: ORANGE,
    alignItems: "center",
    justifyContent: "center",
  },
  logoLetter: {
    color: WHITE,
    fontSize: 26,
    fontWeight: "700",
  },
  logoName: {
    fontSize: 22,
    fontWeight: "700",
    color: NAVY,
    letterSpacing: -0.3,
  },
  logoTag: {
    fontSize: 10,
    fontWeight: "600",
    color: SLATE,
    letterSpacing: 1.2,
    marginTop: 1,
  },

  // Headings
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: NAVY,
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sub: {
    fontSize: 15,
    color: SLATE,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },

  // Card
  card: {
    width: "100%",
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: NAVY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
    gap: 10,
  },

  // Form
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: NAVY,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    color: NAVY,
    backgroundColor: CREAM,
  },
  error: {
    color: "#C0392B",
    fontSize: 12,
    marginTop: -4,
  },

  // Primary button
  btn: {
    backgroundColor: ORANGE,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: { opacity: 0.45 },
  btnPressed: { opacity: 0.75 },
  btnText: {
    color: WHITE,
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.2,
  },

  // Ghost button
  ghostBtn: {
    paddingVertical: 10,
    alignItems: "center",
  },
  ghostText: {
    color: ORANGE,
    fontWeight: "600",
    fontSize: 14,
  },

  // Link row
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
    flexWrap: "wrap",
  },
  linkMuted: {
    color: SLATE,
    fontSize: 14,
  },
  linkAccent: {
    color: ORANGE,
    fontWeight: "600",
    fontSize: 14,
  },
});

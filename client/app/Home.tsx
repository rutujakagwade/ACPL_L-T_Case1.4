    import { View, Text, TouchableOpacity, Image } from "react-native";
    import { Link } from "expo-router";

    export default function Welcome() {
    return (
        <View className="flex-1 bg-white">
        {/* Top Illustration */}
        <View className="flex-1 justify-center items-center">
            <Image
            source={require("@/assets/images/WelcomeIllustration.png")}
            className="w-72 h-72"
            resizeMode="contain"
            />
        </View>

        {/* Bottom Section */}
        <View className="bg-yellow-300 rounded-t-3xl p-6">
            <Text className="text-2xl font-bold text-center text-black">
            Good To See You!
            </Text>
            <Text className="text-gray-700 text-center mt-2">
            Efficiently manage journeys and streamline expense reporting
            </Text>

            {/* Login Button */}
            <Link href="/login" asChild>
            <TouchableOpacity className="bg-black py-3 rounded-2xl mt-6">
                <Text className="text-white text-center font-semibold">
                Login with us
                </Text>
            </TouchableOpacity>
            </Link>

            {/* Register Button */}
            <Link href="/register" asChild>
            <TouchableOpacity className="border border-black py-3 rounded-2xl mt-3">
                <Text className="text-black text-center font-semibold">
                I’m new, sign me up
                </Text>
            </TouchableOpacity>
            </Link>

            <Text className="text-xs text-center text-gray-600 mt-4">
            By logging in or registering, you agree to our{" "}
            <Text className="font-semibold">Terms of service</Text> and{" "}
            <Text className="font-semibold">Privacy policy</Text>.
            </Text>
        </View>
        </View>
    );
    }

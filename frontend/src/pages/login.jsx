import { Button, Card, Checkbox, Label, TextInput } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { api } from "../api/client";

export function Component() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { data } = await api.post("/auth/login", {
                email,
                password,
            });

            if (!data?.success || !data?.token || !data?.user) {
                throw new Error("Invalid login response from server.");
            }

            login(data.user, data.token);

            if (data.user.role === "admin") {
                navigate("/admin-dashboard");
            } else {
                navigate("/customer-dashboard");
            }
        } catch (err) {
            const message = err?.response?.data?.message || err?.message || "Login failed.";
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center h-screen justify-center">
            <Card className="min-w-sm">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="email1">Your email</Label>
                        </div>
                        <TextInput
                            id="email1"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="password1">Your password</Label>
                        </div>
                        <TextInput
                            id="password1"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <Button type="submit" isProcessing={loading} disabled={loading}>
                        {loading ? "Signing in..." : "Submit"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
